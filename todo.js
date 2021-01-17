dragged_task = null;

function setThemeColors (theme_id){

    var theme_variables_names = ["site-bg", "site-title", "tasks-input-text", "tasks-input-placeholder-text", 
    "tasks-module-shadow", "tasks-bg", "tasks-circle-border", "tasks-circle-hover-border", "tasks-icon-circle-bg", 
    "tasks-checkmark-idle-bg", "tasks-checkmark-done-bg", "tasks-separator", "tasks-text-color", "tasks-completed-text-color", "tasks-drag-over",
    "tasks-navbar-bg", "tasks-navbar-gray", "tasks-navbar-dark-gray", "tasks-navbar-counter", "tasks-navbar-middle-hover", "tasks-all-filter-btn-bg"];

    theme_variables_names.forEach(element => {
        
        general_name =  `--${element}`;

        if(theme_id == 'D') theme_name = `--dark-${element}`; 
        if(theme_id == 'L') theme_name = `--light-${element}`; 
        
        document.documentElement.style.setProperty(`${general_name}`,`var(${theme_name})`);
        
        if(theme_id == 'D')  $("#site_backdrop").css("background-image","url('images/bg-desktop-dark.jpg')");
        if(theme_id == 'L')  $("#site_backdrop").css("background-image","url('images/bg-desktop-light.jpg')");

        if(theme_id == 'L')  $("#site_theme_toggle").html( "<img src='./images/icon-moon.svg' alt='Toggle dark theme' aria-label='Set theme to dark'>" );
        if(theme_id == 'D')  $("#site_theme_toggle").html( "<img src='./images/icon-sun.svg' alt='Toggle light theme' aria-label='Set theme to light'>" );

    });

}

function changeTheme() {

    var theme_button = $("#site_theme_toggle");

    if (theme_button.attr('current_theme') == 'D') theme_button.attr('current_theme', 'L'); 
    else if (theme_button.attr('current_theme') == 'L') theme_button.attr('current_theme', 'D'); 
    
    setThemeColors(theme_button.attr('current_theme'));

}

function countTasks(){

    var tasks_left = 0;
   
    $('.task:not(#task_input)').each( (index, element) => {

        entry_state = element.getAttribute('task_state');
        if (entry_state == 'active') tasks_left++;

    });

   //tasks_left_text = `${$(".task").length - 1} items left`  
   tasks_left_text = `${tasks_left} items left`  

   $("#tasks_counter").text(tasks_left_text)

}

$("#task_input_text").on("keyup", (event) => {

    if (event.keyCode == 13) {
        
        if( $("#task_input_text").val() ){
        
            var tasks_dashboard = document.getElementById('tasks_dashboard');

            var new_task = document.createElement('div');
            
            new_task.className = 'task'

            var new_task_icon_holder = document.createElement('div'); 
            new_task_icon_holder.className = 'task_type_icon_holder'
            new_task_icon_holder.setAttribute('title','Mark as complete');
            new_task_icon_holder.setAttribute('aria-label','Mark this task as completed');

            var new_task_icon_circle_wrapper = document.createElement('div');
            new_task_icon_circle_wrapper.className = 'task_type_icon_circle_wrapper'
            new_task_icon_circle_wrapper.setAttribute("onclick","completeTask(this)");
            
            var new_task_icon_circle = document.createElement('div');
            new_task_icon_circle.className = 'task_type_icon_circle';

            var new_task_text = document.createElement('p')
            new_task_text.className = 'task_text';
            
            var new_task_cancel_button = document.createElement('button');
            new_task_cancel_button.classList.add("task_cancel") 
            new_task_cancel_button.classList.add("clear_button");
            new_task_cancel_button.setAttribute("onclick","this.parentElement.remove(); countTasks();");
            new_task_cancel_button.setAttribute("title","Cancel this task");
            new_task_cancel_button.setAttribute("aria-label","Cancel selected task");
            
            new_task_text.innerText = $("#task_input_text").val();

            new_task.appendChild(new_task_icon_holder);
            new_task_icon_holder.appendChild(new_task_icon_circle_wrapper);
            new_task_icon_circle_wrapper.appendChild(new_task_icon_circle);
            new_task.appendChild(new_task_text)
            new_task.appendChild(new_task_cancel_button)
            
            new_task.setAttribute("task_state","active");
            new_task.setAttribute("draggable","true");
        
            new_task.addEventListener('dragstart', taskDragStart, false)
            new_task.addEventListener('dragover', taskDragOver, false)
            new_task.addEventListener('dragenter', taskDragEnter, false)
            new_task.addEventListener('dragleave', taskDragLeave, false)
            new_task.addEventListener('dragend', taskDragEnd, false)
            new_task.addEventListener('drop', taskDragDrop, false)

            tasks_dashboard.appendChild(new_task);
            
            $("#task_input_text").val("")       
            
            countTasks();
            filterTasks('all');

        }
    }
})

function taskDragStart(e){
    
    this.style.opacity = 0.4;
    
    dragged_task = this;

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData('text/html', this.innerHTML);
    
}

function taskDragOver(e){

    if (e.preventDefault()){
        e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';
    return false;

}

function taskDragEnter(e){

    this.classList.add('task_drag')

}

function taskDragEnd(e){
    
    this.style.opacity = 1.0;
    this.classList.remove('task_drag')
    
}

function taskDragLeave(e){

    this.classList.remove('task_drag');

}

function taskDragDrop(e){

    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault()

    if (dragged_task !== this) {

        original_task_state = dragged_task.getAttribute('task_state');
        dragged_task_state = this.getAttribute('task_state');
        
        dragged_task.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');

        this.setAttribute('task_state', original_task_state);
        dragged_task.setAttribute('task_state', dragged_task_state)

    }

    this.classList.remove('task_drag')
    countTasks();

    return false;

}

function filterTasks(target_state){

    $(".task:not(#task_input)").each( (index, element) => {
        element.removeAttribute("style")
    });

    if(target_state != 'all'){
        $(".task:not(#task_input)").each( (index, element) => {
            
            entry_state = element.getAttribute('task_state')
            if(entry_state != target_state) {

                element.style.display = 'none';

            }

        });
    }
    
    $('.filter_btn').each( (_, btn) => {
        btn.style.color = 'var(--tasks-navbar-dark-gray)';
    });
    
    $(`#filter_${target_state}_btn_des`)[0].style.color = 'var(--tasks-current-filter-btn-bg)';
    $(`#filter_${target_state}_btn_mob`)[0].style.color = 'var(--tasks-current-filter-btn-bg)';
    
    countTasks();
    
}

function completeTask(icon_wrapper){

    clicked_wrapper_task = icon_wrapper.parentElement.parentElement
    clicked_wrapper_holder = icon_wrapper.parentElement
    
    current_state = clicked_wrapper_task.getAttribute('task_state')
    
    if(current_state == "active") {
    
        icon_wrapper.innerHTML = "<img src='images/icon-check.svg'>"
        icon_wrapper.style.backgroundImage = "var(--tasks-circle-hover-border)";

        clicked_wrapper_holder.setAttribute('title','Set back to active');
        clicked_wrapper_holder.setAttribute('aria-label','Mark this task back as active');
        
        clicked_wrapper_task.setAttribute('task_state','completed');
        
        clicked_wrapper_task_text = clicked_wrapper_task.children[1]

        clicked_wrapper_task_text.style.textDecoration = 'line-through'
        clicked_wrapper_task_text.style.color = 'var(--tasks-completed-text-color)'

    }
    if(current_state == "completed"){

        clicked_wrapper_task_text = clicked_wrapper_task.children[1]

        clicked_wrapper_task_text.style.textDecoration = 'none'
        clicked_wrapper_task_text.style.color = 'var(--tasks-text-color)'
        
        clicked_wrapper_task.setAttribute('task_state','active');
         
        clicked_wrapper_holder.setAttribute('title','Mark as complete');
        clicked_wrapper_holder.setAttribute('aria-label','Mark this task as completed');
        
        icon_wrapper.style.backgroundImage = "";
        icon_wrapper.innerHTML = '<div id="task_input_icon_circle"></div>'

    }
    
    countTasks();

}

function clearCompletedTasks() {
    
    $(".task:not(#task_input)").each( (index, element) => {

        if (element.getAttribute('task_state') == 'completed') { element.remove(); }

    });
    
    countTasks();
    filterTasks('all');
}

$(document).ready( () => {
    
    $("#site_theme_toggle").attr('current_theme', 'L'); 
    countTasks()

});
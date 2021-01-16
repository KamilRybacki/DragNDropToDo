function setThemeColors (theme_id){

    var theme_variables_names = ["site-bg", "site-title", "tasks-input-text", "tasks-input-placeholder-text", 
    "tasks-module-shadow", "tasks-bg", "tasks-circle-border", "tasks-circle-hover-border", "tasks-icon-circle-bg", 
    "tasks-checkmark-idle-bg", "tasks-checkmark-done-bg", "tasks-separator", "tasks-text-color", "tasks-completed-text-color", 
    "tasks-navbar-bg", "tasks-navbar-gray", "tasks-navbar-dark-gray", "tasks-navbar-counter", "tasks-navbar-middle-hover", "tasks-all-filter-btn-bg"];

    theme_variables_names.forEach(element => {
        
        general_name =  `--${element}`;

        if(theme_id == 'D') theme_name = `--dark-${element}`; 
        if(theme_id == 'L') theme_name = `--light-${element}`; 
        
        document.documentElement.style.setProperty(`${general_name}`,`var(${theme_name})`);
        
        if(theme_id == 'D')  $("#site_backdrop").css("background-image","url('images/bg-desktop-dark.jpg')");
        if(theme_id == 'L')  $("#site_backdrop").css("background-image","url('images/bg-desktop-light.jpg')");

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
            
            new_task_text.innerText = $("#task_input_text").val();

            new_task.appendChild(new_task_icon_holder);
            new_task_icon_holder.appendChild(new_task_icon_circle_wrapper);
            new_task_icon_circle_wrapper.appendChild(new_task_icon_circle);
            new_task.appendChild(new_task_text)
            new_task.appendChild(new_task_cancel_button)
            
            new_task.setAttribute("task_state","active");

            tasks_dashboard.appendChild(new_task);
            
            console.log(new_task)

            $("#task_input_text").val("")       
            
            countTasks();

        }
    }
})

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
    
    countTasks();
    
}

function completeTask(icon_wrapper){

    icon_wrapper.innerHTML = "<img src='images/icon-check.svg'>"
    icon_wrapper.style.backgroundImage = "var(--tasks-circle-hover-border)";
    
    clicked_wrapper_task = icon_wrapper.parentElement.parentElement
    
    clicked_wrapper_task.setAttribute('task_state','completed')
    
    clicked_wrapper_task_text = clicked_wrapper_task.children[1]

    clicked_wrapper_task_text.style.textDecoration = 'line-through'
    clicked_wrapper_task_text.style.color = 'var(--tasks-completed-text-color)'
    
    countTasks();

}

function clearCompletedTasks() {
    
    $(".task:not(#task_input)").each( (index, element) => {

        if (element.getAttribute('task_state') == 'completed') { element.remove(); }

    });
    
    countTasks();
}

$(document).ready( () => {
    
    $("#site_theme_toggle").attr('current_theme', 'L'); 
    countTasks()

});
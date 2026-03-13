const input=document.getElementById("todoInput")//getting input over DOM
const btn=document.getElementById("addBtn")//same here
const list=document.getElementById("todoList")//and here
const filters=document.querySelectorAll(".filters button")//this is a nodelist
const dateInput=document.getElementById("todoDate")//same as over filter
const timeInput=document.getElementById("todoTime")//time input
let todos=JSON.parse(localStorage.getItem("todos_v1")||"[]")//getting local storage
let filter="all"//filter is beeing set to all

//save via Localstorage
function save(){
    localStorage.setItem("todos_v1",JSON.stringify(todos))
}


//render over dom and doing classes
function render(){
    list.innerHTML=""

    let visible=todos.filter(t=>{
        if(filter==="open")return !t.done
        if(filter==="done")return t.done
        return true
    })

    visible.forEach((t,i)=>{
        let realIndex=todos.indexOf(t)
        const li=document.createElement("li")
        const text=document.createElement("div")
        const del=document.createElement("div")
        const controls=document.createElement("div")
        const done=document.createElement("div")

        text.className="todoText"+(t.done?" done":"")
        text.innerHTML = t.text

        if(t.date){
            let info=document.createElement("div")
            info.style.fontSize="12px"
            info.style.opacity="0.6"
            info.textContent=`${t.date} ${t.time || ""}`
            text.appendChild(info)
        }
        controls.className="controls"
        done.className="icon"
        done.textContent="✓"
        done.onclick=()=>{todos[realIndex].done=!todos[realIndex].donesave()
            render()
        }

        del.className="icon"
        del.textContent="✕"
        del.onclick=()=>{li.classList.add("remove")
            setTimeout(()=>{todos.splice(realIndex,1)
            save()
            render()
        },260)}

        controls.appendChild(done)
        controls.appendChild(del)
        li.appendChild(text)
        li.appendChild(controls)
        list.appendChild(li)
    })
}

//adds todo
function add(){
    const val=input.value.trim()
    if(!val)return

    todos.push({text:val, done:false, date:dateInput.value, time:timeInput.value, reminded:false})
    input.value=""
    dateInput.value=""
    timeInput.value=""
    save()
    render()
}

btn.onclick=add
//add by enter clicking
input.addEventListener("keypress",e=>{
    if(e.key==="Enter")add()
})
//check active
filters.forEach(b=>{
    b.onclick=()=>{
        filters.forEach(x=>x.classList.remove("active"))
        b.classList.add("active")
        filter=b.dataset.filter
        render()
    }
})
// Nots getting
if ("Notification" in window) {
    Notification.requestPermission()
}
//Timer and nots
setInterval(() => {
    const now = new Date()

    todos.forEach((t,i) => {
        if (t.done || t.reminded || !t.date) return
        const target = new Date(t.date + "T" + (t.time || "00:00"))

        if (now.getTime() >= target.getTime()) {
            if (Notification.permission === "granted") {
                new Notification("Todo Reminder", {
                    body: t.text,
                    icon: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png"
                })
            }
            todos[i].reminded = true
            save()
        }
    })
}, 10000)

render()

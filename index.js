const input=document.getElementById("todoInput")
const btn=document.getElementById("addBtn")
const list=document.getElementById("todoList")
const filters=document.querySelectorAll(".filters button")
const dateInput=document.getElementById("todoDate")
const timeInput=document.getElementById("todoTime")
let todos=JSON.parse(localStorage.getItem("todos_v1")||"[]")
let filter="all"

function save(){
    localStorage.setItem("todos_v1",JSON.stringify(todos))
}

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
        done.onclick=()=>{
            todos[realIndex].done=!todos[realIndex].done
            save()
            render()
        }

        del.className="icon"
        del.textContent="✕"
        del.onclick=()=>{
            li.classList.add("remove")
            setTimeout(()=>{
                todos.splice(realIndex,1)
                save()
                render()
            },260)
        }

        controls.appendChild(done)
        controls.appendChild(del)
        li.appendChild(text)
        li.appendChild(controls)
        list.appendChild(li)
    })
}

function add(){
    const val=input.value.trim()
    if(!val)return

    todos.push({
        text:val,
        done:false,
        date:dateInput.value,
        time:timeInput.value,
        reminded:false
    })

    input.value=""
    dateInput.value=""
    timeInput.value=""

    save()
    render()
}

btn.onclick=add

input.addEventListener("keypress",e=>{
    if(e.key==="Enter")add()
})

filters.forEach(b=>{
    b.onclick=()=>{
        filters.forEach(x=>x.classList.remove("active"))
        b.classList.add("active")
        filter=b.dataset.filter
        render()
    }
})

if ("Notification" in window) {
    Notification.requestPermission()
}

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
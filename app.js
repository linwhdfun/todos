const inputform = document.querySelector(".add");
const ul = document.querySelector("ul");
const search = document.querySelector(".search input");


//make html temp plate

const addTodo = (tododata, id) => {

    let time = tododata.created_at.toDate().toDateString();

    let html = `
        <li data-id="${id}" class="list-group-item d-flex justify-content-between align-items-center">
            <span>${time}</span>
            <div>${tododata.title}</div>
            <i class="far fa-trash-alt delete"></i>
        </li>
    `;

    ul.innerHTML += html
};


//delete html todos

const deletehtml = (id) => {

    const lis = document.querySelectorAll("li");

    lis.forEach((li) => {

        if(li.getAttribute("data-id") === id){
            li.remove();
        };
    });     
};


//get todos from database

db.collection("todolists").onSnapshot(snapshot => {

    snapshot.docChanges().forEach(change => {

        const doc = change.doc;

        if(change.type === "added"){
            addTodo(doc.data(), doc.id);
        } else if (change.type === "removed"){
            deletehtml(doc.id);
        };
    });
});


//add todo to data base(starts here)

inputform.addEventListener("submit", e => {
    e.preventDefault();

    const now = new Date();    
    const todolist = {
        title: inputform.add.value.trim(),
        created_at: firebase.firestore.Timestamp.fromDate(now)
    };

    db.collection("todolists").add(todolist).then(() => {
        console.log("todo added");
    }).catch(err => {
        console.log(err);
    });
});


//press button to delete todo in database.

ul.addEventListener("click", e => {

    //cap I is needed
    if(e.target.tagName === "I"){
        const id = e.target.parentElement.getAttribute("data-id");       

        db.collection("todolists").doc(id).delete().then(() => {
            console.log("todo deleted");
        });
    };
});


//search todos

search.addEventListener("keyup", ()=>{
    const term = search.value.trim().toLowerCase();

    filterToDo(term);

});


//filter rodos
const filterToDo = term => {
    Array.from(ul.children)
        .filter(everyLi => !everyLi.textContent.toLowerCase().includes(term))
        .forEach(everyFilteredLi => everyFilteredLi.classList.add("filtered"));

    
     Array.from(ul.children).filter((forEveryLi) => {
         return forEveryLi.textContent.toLowerCase().includes(term)
     }).forEach((forEachFilteredLi) => {
            forEachFilteredLi.classList.remove("filtered")
     });   
}; 
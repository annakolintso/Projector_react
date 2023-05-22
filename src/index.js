const pageSize = 3;
const pageCount = Math.ceil(data.length / pageSize);
const urlParams = new URLSearchParams(window.location.search);
const currentPage = urlParams.get('page') || 1;
const favList = localStorage.getItem("favList") ? JSON.parse(localStorage.getItem("favList")) : [];

document.querySelectorAll("select").forEach(select => {
    new Choices(select, {
        searchEnabled: false,
        itemSelectText: "",
        shouldSort: false
    });
});
document.getElementById("headerBack").addEventListener("click", (e) => {
    e.preventDefault();
    history.back();
})
document.getElementById("filterArtist").addEventListener("input", (e) => {
    const target = e.target;
    const parent = target.parentNode;
    parent.classList[target.value.length >= 20 ? "add" : "remove"]("error");
})

const itemTemplate = (data) => {
    return `<div class="item-block">
                        <div class="item-block__image">
                            <picture>
                                <source srcset="${data.images['1x']} 1x, ${data.images['2x']} 2x">
                                <img src="${data.images['1x']}"
                                     title="${data.name}"
                                     alt="${data.name}">
                            </picture>
                            <div class="item-block__fav ${favList.includes(data.id.toString()) ? 'active' : ''}" data-id="${data.id}">
                                <svg width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 4.6617C14 8.21672 7.5 11.9998 7.5 11.9998C7.5 11.9998 1 8.21672 1 4.6617C1 -0.165119 7.5 -0.0999381 7.5 4.14814C7.5 -0.0999381 14 -0.0363918 14 4.6617Z" stroke="black" stroke-width="1.10308" stroke-linejoin="round"/>
                                </svg>
                            </div>
                        </div>
                        <h2 class="item-block__name">${data.name}</h2>
                        <p class="item-block__group">${data.group}</p>
                        <div class="item-block__info">
                            <p>Year: <span>${data.year}</span></p>
                            <p>Style: <span>${data.style}</span></p>
                            <p>Country: <span>${data.country}</span></p>
                        </div>
                        <button class="btn btn-blue btn-add"><span>Add</span></button>
                    </div>`
}

const loadItems = () => {
    const from = (currentPage - 1) * pageSize;
    const to = currentPage * pageSize > (data.length + 1) ? data.length + 1 : currentPage * pageSize;
    const pageData = data.slice(from, to);

    pageData.forEach(item => {
        document.getElementById("listItems").insertAdjacentHTML("beforeend", itemTemplate(item));
    });

    document.getElementById("listItems").addEventListener("click", e => {
        const target = e.target;
        const favIcon = target.closest(".item-block__fav");
        if(favIcon) {
            const itemId = favIcon.dataset.id;
            favIcon.classList.toggle("active");

            if(favIcon.classList.contains("active")) {
                favList.push(itemId);
            }else {
                favList.splice(favList.indexOf(itemId), 1);
            }

            localStorage.setItem("favList", JSON.stringify(favList));
        }
    })
}
const initPagination = () => {
    for (let i = 0; i < pageCount; i++) {
        const page = i + 1;
        document.getElementById("pagination")
            .insertAdjacentHTML(
                "beforeend",
                `<a href="./index.html?page=${page}" class="pagination__item ${page == currentPage ? 'active' : ''}">${page}</a>`
            );
    }
}

loadItems();
initPagination();

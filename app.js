const popup = document.querySelector('#popup');
const overlay = document.querySelector('#overlay');
const loginform = document.querySelector('#loginform');
const registerform = document.querySelector('#registerform');


function openForm(type){
    popup.classList.add('active');
    overlay.classList.add('active');
    if(type==='login'){
        loginform.style.display = 'block';
        registerform.style.display = 'none';
    }
    else{
        registerform.style.display = 'block';
        loginform.style.display = 'none';
    }

}
function closeForm(){
    popup.classList.remove('active');
    overlay.classList.remove('active')
}
function switchForm(type){
    if(type==='login'){
        loginform.style.display="block";
        registerform.style.display="none";
    }
    else{
        loginform.style.display="none";
        registerform.style.display="block";
    }
}




let listings = []

function renderListings(filteredListings){
    const grid = document.querySelector('.properties-grid');
    grid.innerHTML = filteredListings.map(listing => `
        <div class="properties-cards">
            <div class="card-wrapper">
            <img src="${listing.img}" alt="${listing.address}">
            <button class="favourite-btn" data-id="${listing.id}">
                    <i class="fa-regular fa-heart"></i>
                </button>
            </div>
            <div class="container">
                <h3>$${listing.price.toLocaleString()}</h3>
                <p>${listing.bedrooms} bedrooms ${listing.baths} baths ${listing.sqft} sqft</p>
                <p>${listing.address}</p>
            </div>
    </div>
    `).join('');
}
async function loadListings(){
    try{
        const response = await fetch('http://127.0.0.1:5000/api/listings');
        const data = await response.json();
        listings = data.listings;
        
        const params = new URLSearchParams(window.location.search);
        const typeParam = params.get('type');

        if(typeParam){
            const filtered = listings.filter(listing => listing.type === typeParam);
            renderListings(filtered);
        }else{
            renderListings(listings);
        }
    } catch (error){
        console.error('Failed to load listings', error);
    }
}
loadListings();

function applyFilters(){
    const maxPrice=Number(document.querySelector('.price-filter').value);
    const minBedrooms = Number(document.querySelector('.bedroom-filter').value);
    const minBaths = Number(document.querySelector('.bath-filter').value);

    const filtered = listings.filter(listing => {
        const setPrice = !maxPrice || listing.price <= maxPrice;
        const setBedrooms = !minBedrooms || listing.bedrooms >= minBedrooms;
        const setBaths = !minBaths || listing.baths >= minBaths;
        return setPrice && setBedrooms && setBaths;
    });
    renderListings(filtered);
    
}
document.querySelector('.price-filter').addEventListener('change', applyFilters);
document.querySelector('.bedroom-filter').addEventListener('change', applyFilters);
document.querySelector('.bath-filter').addEventListener('change', applyFilters);

document.querySelector('.properties-grid').addEventListener('click', function(e){
    const btn = e.target.closest('.favourite-btn');
    if(!btn) return;

    const icon = btn.querySelector('i');
    icon.classList.toggle('fa-regular');
    icon.classList.toggle('fa-solid');

});






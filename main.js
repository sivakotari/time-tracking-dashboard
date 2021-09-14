'use strict';

const profile_name = 'Jeremy Robson';
const data_url = './data.json';

const getData = fetch(data_url).then(res => res.json());
const profile = document.querySelector('.profile');
let cards = document.querySelector('.cards');
let data = '';
let activeTimeframe = '';

// methods
const addListeners = function() {
    document.querySelector('ul').addEventListener('click', e => {
        const {action} = e.target.dataset;
        if(action && action !== activeTimeframe) {
            initCards(action);
            setActiveItem();
        };
    })
};

const setActiveItem = function() {
    const list = document.querySelector('ul');
    list.querySelectorAll('li').forEach(li => li.classList.remove('active'));
    list.querySelector(`li[data-action=${activeTimeframe}]`).classList.add('active');
};

const actionDetailsCard = function(activity, tf) {
    const {title, timeframes: {[tf]: timeframe}} = activity;
    let timeframeText = '';
    if(tf === 'daily') timeframeText = 'Yesterday';
    else if(tf === 'weekly') timeframeText = 'Last Week';
    else if(tf === 'monthly') timeframeText = 'Last Month';
    const template = `<article data-action-widget=${title.split(' ').join('-')} class="card card__wrapper">
        <div class="card__widget">
            <div class="title">${title}</div>
            <div class="stats">
                <div class="current__count">${timeframe.current}hrs</div>
                <div class="previous__count">${timeframeText} - ${timeframe.previous}hrs</div>
            </div>
        </div>
    </article>`;
  return template;
};

const actionListCard = function() {
    const keys = Object.keys(data[0].timeframes);
    // const li = document.createElement("li");
    const li = keys.reduce((acc,action) => acc +=`<li data-action=${action}>${action}</li>`, '');
    const template = `<ul class="action__items">${li}</ul>`;
    return template;
};

const profileCard = function(){
    let template = `<h2 class="sr-only">Profile card of ${profile_name}</h2>`;
    template += `<div class="profile__wrapper">
    <img width='74' height='74' class='profile__pic' src="./images/image-jeremy.png" alt="image-jeremy">
    <div class="profile__name">
    <h5 class="caption">Report for</h5>
    <h1 class="name">${profile_name}</h1>
    </div>
    </div>`;
    template += actionListCard();
    return template;
};

// init cards
const initCards = function(timeframe = 'daily') {
    cards.innerHTML = '';
    let template = `<h2 class="sr-only">${timeframe} activity details of ${profile_name}</h2>`;
    cards.insertAdjacentHTML('beforeend', template);
    data.forEach(element => {
        let content = actionDetailsCard(element, timeframe);
        cards.insertAdjacentHTML('beforeend', content);
    });
    activeTimeframe = timeframe;
}

// state fetch data and render cards
getData.then(json => {
    data = [...json];
    profile.insertAdjacentHTML('beforeend', profileCard(data));
    initCards();
    setActiveItem();
    addListeners();
});
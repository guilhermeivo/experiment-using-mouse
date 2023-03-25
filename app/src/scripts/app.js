import PageCreateMaze from "../pages/CreateMaze"
import CardInfo from "../components/CardInfo"
import apiService from "../services/api"

import { createElementFromHTML } from '../utils/utils'

(() => {
    `strict`

    const scrollerCards = document.querySelector('#scrollerCards')
    apiService.GetAllMazes().then(datas => datas.map(data => {
        scrollerCards.appendChild(createElementFromHTML(`
            <card-info 
                data-id="${ data.id }" 
                data-title="${ data.name }" 
                data-likes="${ data.likes || 0 }" 
                data-views="${ data.views || 0 }">
            </card-info>
            `))
    }))
})()
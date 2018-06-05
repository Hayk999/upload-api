import { Router } from 'express'

import {
    galleryController,
    apartamentController,
    housController
} from 'controllers'

const router = new Router()

// galleries
router.get('/galleries', galleryController.all)
router.get('/galleries/:id', galleryController.get)

// apartamentController
router.get('/apartaments', apartamentController.all)
router.get('/apartaments/:id', apartamentController.get)

// housController
router.get('/houses', housController.all)
router.get('/houses/:id', housController.get)

export default router

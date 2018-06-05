import upload from 'modules/uploader'

import {
    Router
} from 'express'

import {
    galleryController,
    housController,
    collectionContreoller,
    apartamentController,
    areaController,
    garageController,
    commerceController,
    pageController
} from 'controllers'

const router = new Router()

// house
router.get('/houses', housController.all)
router.get('/houses/:id', housController.get)
router.post('/houses', upload('/houses').fields([
    {name: 'images'},
    {name: 'headerImage'}
]), housController.add)
router.put('/houses/:id', upload('/houses').fields([
    {name: 'images'},
    {name: 'headerImage'}
]), housController.update)
router.delete('/houses/:id', housController.remove)

// apartament
router.get('/apartaments', apartamentController.all)
router.get('/apartaments/:id', apartamentController.get)
router.post('/apartaments', upload('/apartaments').fields([
    {name: 'images'},
    {name: 'headerImage'}
]), apartamentController.add)
router.put('/apartaments/:id', upload('/apartaments').fields([
    {name: 'images'},
    {name: 'headerImage'}
]), apartamentController.update)
router.delete('/apartaments/:id', apartamentController.remove)

// area
router.get('/areas', areaController.all)
router.get('/areas/:id', areaController.get)
router.post('/areas', upload('/areas').fields([
   {name: 'images'},
   {name: 'headerImage'} 
]), areaController.add)
router.put('/areas/:id', upload('/areas').fields([
    {name: 'images'},
    {name: 'headerImage'}
]), areaController.update)
router.delete('/areas/:id', areaController.remove)

// garage
router.get('/garages', garageController.all)
router.get('/garages/:id', garageController.get)
router.post('/garages', upload('/garages').fields([
   {name: 'images'},
   {name: 'headerImage'} 
]), garageController.add)
router.put('/garages/:id', upload('/garages').fields([
    {name: 'images'},
    {name: 'headerImage'}
]), garageController.update)
router.delete('/garages/:id', garageController.remove)

// commerceArea
router.get('/commerceareas', commerceController.all)
router.get('/commerceareas/:id', commerceController.get)
router.post('/commerceareas', upload('/commerce').fields([
   {name: 'images'},
   {name: 'headerImage'} 
]), commerceController.add)
router.put('/commerceareas/:id', upload('/commerce').fields([
    {name: 'images'},
    {name: 'headerImage'}
]), commerceController.update)
router.delete('/commerceareas/:id', commerceController.remove)

// galleries
router.get('/galleries', galleryController.all)
router.get('/galleries/:id', galleryController.get)
router.post('/galleries', upload('/galleries').fields([{name: 'image'}]), galleryController.add)
router.put('/galleries/:id', upload('/galleries').fields([{name: 'image'}]), galleryController.update)
router.delete('/galleries/:id', galleryController.remove)

// collections
router.get('/collections', collectionContreoller.all)
router.get('/collections/:id', collectionContreoller.get)
router.post('/collections', collectionContreoller.add)
router.put('/collections/:id', collectionContreoller.update)
router.delete('/collections/:id', collectionContreoller.remove)

// pages
router.get('/pages', pageController.all)
router.get('/pages/:key', pageController.get)
// router.post('/pages', pageController.add)
router.put('/pages/:id', upload('/pages').fields([{ name: 'image' }]), pageController.update)

export default router

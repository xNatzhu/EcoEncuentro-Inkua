"use strict";

const Event = require('../models/events');
const User = require("../models/users");
const { geoLocalization } = require("../utils/geoLocalization");

module.exports = {

    getEvents: async function (req, res, next) {
        try {

            // Not using populate, because the messages and user info necesary are pushed directly in the controllers.
            
            const allEvents = await Event.find();

            if (!allEvents || allEvents.length === 0) {
                return res.status(404).json({ message: 'Eventos no encontrados.' });
            };
            return res.json({ eventos: allEvents });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        };
    },

    getEvent: async function (req, res, next) {
        try {
            const event = req.params.eventId;

            const getEvent = await Event.findById(event);


            if (!getEvent || getEvent.length === 0) {
                return res.status(404).json({ message: 'Eventos no encontrados.' });
            };

            return res.json({ eventos: getEvent });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        };
    },    

    createEvents: async function (req, res, next) {
        try {
            const { title, location, eventImg, createdBy, eventDate, description, category } = req.body;

            const eventOwner = await User.findOne({ _id: createdBy });

            if (!title || !location || !createdBy || !eventDate || !description || !category) {
                return res.status(400).json({ message: 'Faltan campos requeridos en la solicitud.' });
            };

            if(!eventOwner){
                return res.status(404).json({message : "Usuario no encontrado."});
            };

            const eventData = { 
                title,
                location,
                createdBy,
                eventDate,                
                eventImg,
                description,
                category
            };

            const validCategories = ["Árboles", "Hogar", "Industria", "Animales", "Contaminación", "Basurales", "Energía", "Fauna marina"];
            if (!validCategories.includes(category)) {
                return res.status(400).json({ message: 'Categoría no válida.' });
            };

            const map = await geoLocalization(location);

            const newEvent = new Event({
                title,
                location,
                createdBy: {
                    eventOwnedId : eventOwner._id,
                    eventOwnerName: eventOwner.name,
                    eventOwnerEmail: eventOwner.email,
                    eventOwnerImg: eventOwner.userImg
                },
                eventDate,
                map,
                eventImg,
                description,
                category
            });

            await newEvent.save();

            eventOwner.events.push({
                _id: newEvent._id,
                title: newEvent.title,
                eventDate: newEvent.eventDate
            });

            await eventOwner.save();

            return res.status(201).json({
                message: `Evento ${title} creado exitosamente.`,
                mapLink: map,
                evento: eventData
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        };
    },

    usersJoiningEvent: async function (req, res, next) {
        try {
            const { eventId, userId } = req.body;

            const event = await Event.findById(eventId);
            const user = await User.findById(userId);

            if (!event) {
                return res.status(404).json({ message: 'Evento no encontrado.' });
            };

            for(const users of event.usersJoined){
                if(users == userId){
                    return res.status(400).json({ message: "El usuario ya se encuentra subscripto al evento."})
                };
            };

            event.usersJoined.push({
                userId: user._id,
                userName: user.name,
                message: user.email,
                userImage: user.userImg
            });

            await event.save();

            user.events.push({
                eventName: event.title,
                eventId: eventId,
                eventDate: event.eventDate
            });

            await user.save();

            return res.status(200).json({ message: `El usuario ${userId} se unió al evento.` });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        };
    },

    userQuitEvent: async function (req, res, next) {
        try { 
            // Filter and includes doesnt work after change the schema, to review
            const { eventId, userId } = req.body;
            
            const event = await Event.findById(eventId);
            const user = await User.findById(userId);
    
            console.log(user.events)
            console.log(event.usersJoined)
            if (!event) {
                return res.status(404).json({ message: 'Evento no encontrado.' });
            };
    
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            };
    
            if (!user.events.userId.includes(eventId) || !event.usersJoined.includes(userId)) {
                return res.status(400).json({ message: "El usuario no está suscrito a este evento." });
            };
    
            user.events = user.events.filter(eventId => eventId.toString() !== eventId);
            event.usersJoined = event.usersJoined.filter(userId => userId.toString() !== userId);
    
            await user.save();
            await event.save();
    
            return res.status(200).json({ message: `El usuario ${userId} abandonó el evento.` });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        };
    },

    updateEvent: async function (req, res, next){
        try{
            const { userId, eventId, title, location, eventImg, eventDate, description, category } = req.body;

            const event = Event.findById(eventId);

            if(userId !== event){ // buscar el id del creador de evento aa modificar
                return res.status(401).json({ message: "Solo el creador del evento puede modificarlo."})
            };

            if(!event){
                return res.status(404).json({ message: "Evento no encontrado, por favor verifica la existencia del mismo."})
            };

            if (eventImg) {
                let eventImgData;
                let eventImgFileName;
                if (eventImg.startsWith('data:image/')) {
                    eventImgData = eventImg;
                    eventImgFileName = `${event._id}.png`;
                } else {
                    eventImgData = Buffer.from(eventImg).toString('base64');
                    eventImgFileName = `${event._id}.png`;
                };
                const neweventImgPath = path.join(__dirname, '..', 'assets', 'events', eventImgFileName);
                fs.writeFileSync(neweventImgPath, eventImgData);
                event.eventImg = eventImgFileName;
            };

            const toUpdate = { title, location, eventDate, description, category };

            for (const field in toUpdate) {
                if (toUpdate[field] !== undefined) {
                    event[field] = toUpdate[field];
                };
            };

            await event.save();

            return res.status(200).json({ message: `El evento ${title}, ${eventId} fue actualizado.`})
        } catch(error){
            return res.status(500).json({ message: 'Error interno del servidor.' + error });
        };
    },

    deleteEvent: async function (req, res, next) {
        try {
            const { userDeleting } = req.body;
            const { eventId } = req.params;

            const event =  await Event.findOne({eventId});

            // Modify this search created by to work
            if(userDeleting !== event.createdBy.eventOwnedId.valueOf()){
                return res.status(403).json({ message: 'No autorizado, solo el creado del evento puede eliminarlo.' });
            };

            const deletedEvent = await Event.findByIdAndDelete(eventId);
            if (!deletedEvent) {
                return res.status(404).json({ message: 'Evento no encontrado.' });
            };

            return res.status(200).json({ message: `El evento ${deletedEvent.title} fue eliminado.` });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        };
    },
    
    deleteAllEvents: async function (req, res, next) {
        try {
            const deletedEvent = await Event.deleteMany({});

            return res.status(200).json({ message: `Eventos eliminados.` });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        };
    }
        
};
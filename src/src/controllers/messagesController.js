"use strict";

const Message = require("../models/messages");
const Users = require("../models/users");
const Events = require("../models/events");

module.exports = {
    getMessages : async (req, res) => {
        try {
              const messages = await Message.find();

              return res.json(messages);
        } catch (error) {
              console.error(error);
              return res.status(500).json({ error: "Error al obtener los mensajes" });
        };
    },

    createMessages : async (req, res) => {
        try {
            const { user, event, message } = req.body;

            if (!user || !event || !message) {
                return res.status(400).json({ error: "Faltan campos obligatorios" });
            };

            const existingUser = await Users.findById(user);
            const existingEvent = await Events.findById(event);

            if (!existingUser || !existingEvent) {
                return res.status(404).json({ error: "Usuario o evento no encontrado" });
            };

            const newMessage = await Message.create({
                user,
                event,
                message,
                isRead: false,
            });

            await Users.findByIdAndUpdate(user, { $push: { messages: { messageId: newMessage._id,message: message } } });
            await Events.findByIdAndUpdate(event, { $push: { messages: { messageId: newMessage._id,message: message } } });

            return res.status(201).json(newMessage);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al crear el mensaje" });
        };
    },

    deleteMessage : async (req, res) => {
        try {
            const { messageId } = req.body;
            console.log(messageId)

            const existingMessage = await Message.findById(messageId);
            if (!existingMessage) {
              return res.status(404).json({ error: "Mensaje no encontrado" });
            };

            //if (existingMessage.user.toString() !== req.user.id) {
            //  return res.status(403).json({ error: "No tienes permiso para eliminar este mensaje" });
            //};

            await Message.findByIdAndDelete(messageId);
            
            return res.json({ message: "Mensaje eliminado exitosamente" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al eliminar el mensaje" });
        };
    },

    deleteAllMessages : async (req, res) => {
        try {
            await Message.deleteMany({});
            return res.json({ message: "Todos los mensajes han sido eliminados" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al eliminar todos los mensajes" });
        };
    }
};
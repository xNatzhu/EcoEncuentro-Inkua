"use strict";

const users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationPassword, validationEmail } = require("../utils/validation")
const config = require('../middleware/authMiddleware');
const { checkInputs } = require("../middleware/securityMiddleware");

// Img
const fs = require('fs');
const path = require('path');

module.exports = {

    getUsers: async function (req, res, next) {
        try {
            const allUsers = await users.find({}, { password: 0 });

            if (!allUsers || allUsers.length === 0) {
                return res.status(404).json({ message: 'Usuarios no encontrados.' });
            };

            return res.json({ usuarios: allUsers });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        };
    },

    createUsers: async function (req, res, next) {
        try {
            const { name, email, password, userImg } = req.body;

            if(checkInputs({name, email, password})){
                return res.status(403).json({ message: "Error verifique la informacion, se detecto un posible peligro"})
            };

            if (!name || !email || !password) {
                return res.status(400).json({ message: 'Faltan propiedades requeridas del usuario.' });
            };

            const existingUser = await users.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: 'El correo electrónico ya está en uso.' });
            };

            // Validation and hash password
            const hashedPassword = validationPassword(password);
            if (hashedPassword instanceof Error) {
                return res.status(400).json({ message: hashedPassword.message });
            };

            validationEmail(email);
            if(!email){
                return res.status(400).json({message: "El email proporcionado es incorrecto."});
            };

            let newUser;
            
            if(userImg){
                newUser = new users({
                    name,
                    email,
                    password: hashedPassword,
                    userImg: userImg
                });
            }else{
                newUser = new users({
                    name,
                    email,
                    password: hashedPassword,
                });
            };
                                                              
            await newUser.save();

            const token = jwt.sign(
                {
                    userId: newUser._id,
                    email: newUser.email,
                },
                config.jwtSecret,
                {
                    expiresIn: '1h',
                }
            );

            return res.json({ message: 'Usuario creado exitosamente.', token, _id: newUser._id, name: newUser.name, userImg: newUser.userImg });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        };
    },

    loginUsers: async function (req, res, next) {
        try {
            const { email, password } = req.body;

            if(checkInputs({email, password})){
                return res.status(403).json({ message: "Error verifique la informacion, se detecto un posible peligro"})
            };

            const user = await users.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'No se encontró un usuario con ese correo electrónico.' });
            };

            const passwordMatch = bcrypt.compareSync(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ message: `Contraseña incorrecta.` });
            };

            const token = jwt.sign(
                {
                    userId: user._id,
                    email: user.email,
                },
                config.jwtSecret,
                {
                    expiresIn: '1h',
                }
            );

            return res.json({ message: 'Usuario loggeado.', token, _id: user._id, name: user.name, userImg: user.userImg});
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        };
    },

    userUpdate: async function (req, res, next) {
        try {
            const { email, name, password, userImg } = req.body;

            if(checkInputs({email, name, password})){
                return res.status(403).json({ message: "Error verifique la informacion, se detecto un posible peligro"})
            };

            const user = await users.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado." });
            };

            if (name !== undefined) {
                user.name = name;
            };

            if (password !== undefined) {
                user.password = validationPassword(password);
            };

            if (email !== undefined) {
                user.email = email;
            };

            if (userImg) {
                let userImgData;
                let userImgFileName;
    
                if (userImg.startsWith('data:image/')) {
                    userImgData = userImg;
                    userImgFileName = `${user._id}.png`;
                } else {
                    userImgData = Buffer.from(userImg).toString('base64');
                    userImgFileName = `${user._id}.png`;
                };
    
                const newUserImgPath = path.join(__dirname, '..', 'assets', 'users', userImgFileName);
                fs.writeFileSync(newUserImgPath, userImgData);
                user.userImg = userImgFileName;
            };

            await user.save();

            return res.status(200).json({ message: `Los datos del usuario ${user.name} fueron actualizados.` });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        };
    },

    deleteUser: async function (req, res, next) {
        try {
            const { userId } = req.body;
            const { emailToDelete } = req.params;
            
            if(checkInputs({ userId })){
                return res.status(403).json({ message: "Error verifique la informacion, se detecto un posible peligro"})
            };
    
            const user = await users.findOne({ email: emailToDelete });
    
            if (!user) {
                return res.status(404).json({ message: `Usuario ${emailToDelete} no encontrado.` });
            };
    
            if (user._id.toString() !== userId) {
                return res.status(401).json({ message: 'Solo puedes eliminar tu propio perfil.' });
            };
    
            const deletedUser = await users.findOneAndDelete({ email: emailToDelete });
    
            if (!deletedUser) {
                return res.status(404).json({ message: `Usuario ${emailToDelete} no encontrado.` });
            };
    
            return res.json({ message: `Usuario ${emailToDelete} eliminado exitosamente.` });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        };
    },
    

    deleteAllUsers: async function (req, res, next) {
        try {
            await users.deleteMany();
        
            return res.json({ message: "All users deleted successfully." });
        } catch (error) {
            console.log(error);
            return errorHandler(500, "Internal server error.", res);
        };
    }
};
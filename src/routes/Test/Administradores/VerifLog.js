const express = require('express')
const VerifLog = express()
const jwt = require("jsonwebtoken")
const Comparar = require("../../../lib/Funciones/Comparador")
const Consultador = require("../../../../database/Consultador")

VerifLog.post("/test/veriflog", async (req, res) => {
    const token = req.headers['x-access-token']
    let result1
    let respuesta
    const query = Consultador()

    if (!token) {
        respuesta = {
            status: 500,
            error: "No tiene los permisos para esta operación"
        }
        res.send(respuesta)
    } else if (token === null) {
        respuesta = {
            status: 500,
            error: "No tiene los permisos para esta operación"
        }
        res.send(respuesta)
    } else {
        try {
            const decoded = await jwt.verify(token, process.env.SECRET);
            const user = decoded.user
            const admin = decoded.admin
            const pass = decoded.pass

            const sql1 = "SELECT pass, nombre, apellido FROM administradores WHERE usuario = ? AND admin = ?"

            try {
                result1 = await query({
                    sql: sql1,
                    timeout: 2000,
                    values: [user, admin]
                })
            } finally {
                const passDB = result1[0].pass
                const nombre = result1[0].nombre
                const apellido = result1[0].apellido
                const datos = {
                    nombre,
                    apellido
                }

                const comprobar = await Comparar(pass, passDB)

                if (comprobar) {
                    respuesta = {
                        status: 200,
                        result: datos
                    }
                    res.send(respuesta)
                } else {
                    respuesta = {
                        status: 500,
                        error: "No tiene los permisos para esta operación"
                    }
                    res.send(respuesta)
                }
            }
        } catch (error) {
            respuesta = {
                status: 500,
                error: "No tiene los permisos para esta operación"
            }
            res.send(respuesta)
        }
    }
})

module.exports = VerifLog
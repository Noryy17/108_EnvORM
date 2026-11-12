require('dotenv').config();

const express = require('express');
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

// CREATE - tambah komik baru
app.post('/komik', async (req, res) => {
    const { title, description, author } = req.body;
    try {
        const komik = await db.Komik.create({ title, description, author });
        res.status(201).send(komik);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// READ - ambil semua komik
app.get('/komik', async (req, res) => {
    try {
        const komik = await db.Komik.findAll({ order: [['id', 'ASC']] });
        res.send(komik);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// READ - ambil satu komik berdasarkan id
app.get('/komik/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const komik = await db.Komik.findByPk(id);
        if (!komik) {
            return res.status(404).send({ message: 'Komik tidak ditemukan' });
        }
        res.send(komik);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// UPDATE - ubah data komik berdasarkan id
app.put('/komik/:id', async (req, res) => {
    const id = req.params.id;
    const { title, description, author } = req.body;

    try {
        const komik = await db.Komik.findByPk(id);
        if (!komik) {
            return res.status(404).send({ message: 'Komik tidak ditemukan' });
        }

        await komik.update({ title, description, author });
        res.send({ message: 'Komik berhasil diupdate', komik });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// DELETE - hapus komik berdasarkan id
app.delete('/komik/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const komik = await db.Komik.findByPk(id);
        if (!komik) {
            return res.status(404).send({ message: 'Komik tidak ditemukan' });
        }

        await komik.destroy();
        res.send({ message: 'Komik berhasil dihapus' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// sync() membuat tabel "komik" otomatis lewat Sequelize jika belum ada,
// setelah itu server baru dijalankan
db.sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });

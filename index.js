require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
if (!process.env.PRIVATE_APP_ACCESS) {
    throw new Error('PRIVATE_APP_ACCESS is not set');
}

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const HUBSPOT_OBJECT = '2-252531259';
const HUBSPOT_BASE_URL = `https://api.hubspot.com/crm/v3/objects/`;

const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get('/', async (req, res) => {
    const studies = `${HUBSPOT_BASE_URL}${HUBSPOT_OBJECT}?properties=course_name,course_description,course_duration`;

    try {
        const resp = await axios.get(studies, { headers });

        console.log(JSON.stringify(resp.data.results, null, 2));

        const data = resp.data.results;
        res.render('studies', { title: 'Courses | HubSpot APIs', data });

    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get('/update-cobj', async (req, res) => {

    const objectId = req.query.id;

    if (!objectId) {
        return res.render('update-cobj', {
            title: 'Add Course | HubSpot APIs',
            study: null
        });
    }

    // Update selected course
    const url = `${HUBSPOT_BASE_URL}${HUBSPOT_OBJECT}/${encodeURIComponent(objectId)}?properties=course_name,course_description,course_duration`;

    try {
        const resp = await axios.get(url, { headers });

        res.render('update-cobj', {
            title: 'Update Course | HubSpot APIs',
            study: resp.data
        });

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Unable to retrieve the course');
    }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post('/update-cobj', async (req, res) => {

    const objectId = req.query.id;

    const update = {
        properties: {
            course_name: req.body.course_name,
            course_description: req.body.course_description,
            course_duration: req.body.course_duration
        }
    };

    try {

        // Existing study - update it
        if (objectId) {

            const url = `${HUBSPOT_BASE_URL}${HUBSPOT_OBJECT}/${encodeURIComponent(objectId)}`;

            await axios.patch(url, update, { headers });

        } else {

            // New study - create it
            const url = `${HUBSPOT_BASE_URL}${HUBSPOT_OBJECT}`;

            await axios.post(url, update, { headers });

        }

        res.redirect('/');

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Unable to save the course');
    }
});

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
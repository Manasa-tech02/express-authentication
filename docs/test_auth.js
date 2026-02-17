
const http = require('http');

const postData = JSON.stringify({
    email: `test_node_${Date.now()}@example.com`,
    password: 'password123',
    name: 'Node Test User'
});

const optionsRegister = {
    hostname: 'localhost',
    port: 3002,
    path: '/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const registerRequest = http.request(optionsRegister, (res) => {
    console.log(`Register Status: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log(`Register Body: ${data}`);
        login();
    });
});

registerRequest.on('error', (e) => {
    console.error(`Register Error: ${e.message}`);
});

registerRequest.write(postData);
registerRequest.end();

function login() {
    const loginData = JSON.stringify({
        email: JSON.parse(postData).email,
        password: 'password123'
    });

    const optionsLogin = {
        hostname: 'localhost',
        port: 3002,
        path: '/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(loginData)
        }
    };

    const loginRequest = http.request(optionsLogin, (res) => {
        console.log(`Login Status: ${res.statusCode}`);
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log(`Login Body: ${data}`);
            const token = JSON.parse(data).token;
            if (token) {
                testProtected(token);
            }
        });
    });

    loginRequest.on('error', (e) => {
        console.error(`Login Error: ${e.message}`);
    });

    loginRequest.write(loginData);
    loginRequest.end();
}

function testProtected(token) {
    const optionsMe = {
        hostname: 'localhost',
        port: 3002,
        path: '/auth/me',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    const meRequest = http.request(optionsMe, (res) => {
        console.log(`Me Status: ${res.statusCode}`);
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log(`Me Body: ${data}`);
            testAdmin(token);
        });
    });

    meRequest.on('error', (e) => {
        console.error(`Me Error: ${e.message}`);
    });

    meRequest.end();
}

function testAdmin(token) {
    const optionsAdmin = {
        hostname: 'localhost',
        port: 3002,
        path: '/auth/admin',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    const adminRequest = http.request(optionsAdmin, (res) => {
        console.log(`Admin Status: ${res.statusCode}`);
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log(`Admin Body: ${data}`);
        });
    });

    adminRequest.on('error', (e) => {
        console.error(`Admin Error: ${e.message}`);
    });

    adminRequest.end();
}

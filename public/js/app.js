"use strict";
const { createApp } = Vue;
createApp({
    data() {
        return {
            title: 'Vue.js + Express.js Application',
            helloResponse: null,
            users: [],
            userResponse: null,
            newUser: {
                name: '',
                email: ''
            }
        };
    },
    methods: {
        async fetchHello() {
            try {
                const response = await fetch('/api/hello');
                const data = await response.json();
                this.helloResponse = JSON.stringify(data, null, 2);
            }
            catch (error) {
                this.helloResponse = 'Error: ' + error.message;
            }
        },
        async fetchUsers() {
            try {
                const response = await fetch('/api/users');
                const data = await response.json();
                this.users = data;
                this.userResponse = null;
            }
            catch (error) {
                this.userResponse = 'Error: ' + error.message;
            }
        },
        async addUser() {
            if (!this.newUser.name || !this.newUser.email) {
                this.userResponse = 'Please fill in both name and email';
                return;
            }
            try {
                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.newUser)
                });
                if (response.ok) {
                    const newUser = await response.json();
                    this.userResponse = 'User created successfully: ' + JSON.stringify(newUser, null, 2);
                    this.newUser.name = '';
                    this.newUser.email = '';
                    // Refresh the users list
                    this.fetchUsers();
                }
                else {
                    const error = await response.json();
                    this.userResponse = 'Error: ' + error.error;
                }
            }
            catch (error) {
                this.userResponse = 'Error: ' + error.message;
            }
        }
    },
    mounted() {
        // Load initial data
        this.fetchHello();
        this.fetchUsers();
    }
}).mount('#app');
//# sourceMappingURL=app.js.map
// SkillSwap Platform JavaScript

class SkillSwapApp {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.sessions = JSON.parse(localStorage.getItem('sessions')) || {};
        this.skills = JSON.parse(localStorage.getItem('skills')) || {};
        this.friendships = JSON.parse(localStorage.getItem('friendships')) || {};
        this.swapRequests = JSON.parse(localStorage.getItem('swapRequests')) || {};
        this.availability = JSON.parse(localStorage.getItem('availability')) || {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        this.loadDashboard();
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('home-link').addEventListener('click', () => this.showSection('welcome'));
        document.getElementById('browse-link').addEventListener('click', () => this.showSection('browse'));
        document.getElementById('login-link').addEventListener('click', () => this.showSection('auth'));
        document.getElementById('signup-link').addEventListener('click', () => this.showSection('auth'));
        document.getElementById('logout-link').addEventListener('click', () => this.logout());
        document.getElementById('profile-link').addEventListener('click', () => this.showSection('profile'));
        document.getElementById('friends-link').addEventListener('click', () => this.showSection('dashboard'));
        document.getElementById('swaps-link').addEventListener('click', () => this.showSection('swaps'));

        // Hero buttons
        document.getElementById('get-started-btn').addEventListener('click', () => {
            if (this.currentUser) {
                this.showSection('dashboard');
            } else {
                this.showSection('auth');
            }
        });
        document.getElementById('learn-more-btn').addEventListener('click', () => this.showLearnMore());

        // Auth form switches
        document.getElementById('switch-to-signup').addEventListener('click', () => this.switchAuthForm('signup'));
        document.getElementById('switch-to-login').addEventListener('click', () => this.switchAuthForm('login'));

        // Form submissions
        document.getElementById('login-form-element').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('signup-form-element').addEventListener('submit', (e) => this.handleSignup(e));

        // Dashboard buttons
        document.getElementById('add-skill-offered-btn').addEventListener('click', () => this.openSkillModal('offered'));
        document.getElementById('add-skill-wanted-btn').addEventListener('click', () => this.openSkillModal('wanted'));
        document.getElementById('dashboard-add-skill-offered-btn').addEventListener('click', () => this.openSkillModal('offered'));
        document.getElementById('dashboard-add-skill-wanted-btn').addEventListener('click', () => this.openSkillModal('wanted'));
        document.getElementById('find-friends-btn').addEventListener('click', () => this.openFriendsModal());
        document.getElementById('edit-availability-btn').addEventListener('click', () => this.openAvailabilityModal());
        document.getElementById('dashboard-edit-availability-btn').addEventListener('click', () => this.openAvailabilityModal());

        // Profile buttons
        document.getElementById('edit-profile-btn').addEventListener('click', () => this.openEditProfileModal());

        // Browse skills
        document.getElementById('search-skills-btn').addEventListener('click', () => this.searchSkills());
        document.getElementById('skill-search').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchSkills();
        });

        // Swaps tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchSwapTab(e.target.dataset.tab));
        });

        // Modal controls
        document.getElementById('close-modal').addEventListener('click', () => this.closeSkillModal());
        document.getElementById('close-availability-modal').addEventListener('click', () => this.closeAvailabilityModal());
        document.getElementById('close-friends-modal').addEventListener('click', () => this.closeFriendsModal());
        document.getElementById('close-swap-modal').addEventListener('click', () => this.closeSwapModal());
        document.getElementById('close-edit-profile-modal').addEventListener('click', () => this.closeEditProfileModal());
        document.getElementById('cancel-skill').addEventListener('click', () => this.closeSkillModal());
        document.getElementById('cancel-availability').addEventListener('click', () => this.closeAvailabilityModal());
        document.getElementById('cancel-swap').addEventListener('click', () => this.closeSwapModal());
        document.getElementById('cancel-edit-profile').addEventListener('click', () => this.closeEditProfileModal());

        // Form submissions
        document.getElementById('add-skill-form').addEventListener('submit', (e) => this.handleAddSkill(e));
        document.getElementById('availability-form').addEventListener('submit', (e) => this.handleAvailabilitySubmit(e));
        document.getElementById('swap-request-form').addEventListener('submit', (e) => this.handleSwapRequest(e));
        document.getElementById('edit-profile-form').addEventListener('submit', (e) => this.handleEditProfile(e));

        // Friends search
        document.getElementById('search-friends-btn').addEventListener('click', () => this.searchFriends());

        // Profile privacy toggle
        document.getElementById('profile-privacy-toggle').addEventListener('change', (e) => this.toggleProfilePrivacy(e));

        // Mobile menu
        document.getElementById('hamburger').addEventListener('click', () => this.toggleMobileMenu());

        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeSkillModal();
                this.closeAvailabilityModal();
                this.closeFriendsModal();
                this.closeSwapModal();
                this.closeEditProfileModal();
            }
        });
    }

    // Authentication Methods
    checkAuthStatus() {
        const sessionId = localStorage.getItem('currentSession');
        if (sessionId && this.sessions[sessionId]) {
            this.currentUser = this.sessions[sessionId];
            this.showAuthenticatedUI();
            this.showSection('dashboard');
        } else {
            this.showUnauthenticatedUI();
            this.showSection('welcome');
        }
    }

    showAuthenticatedUI() {
        document.getElementById('login-link').style.display = 'none';
        document.getElementById('signup-link').style.display = 'none';
        document.getElementById('browse-link').style.display = 'inline';
        document.getElementById('profile-link').style.display = 'inline';
        document.getElementById('friends-link').style.display = 'inline';
        document.getElementById('swaps-link').style.display = 'inline';
        document.getElementById('logout-link').style.display = 'inline';
        document.getElementById('user-name').textContent = this.currentUser.name;
        
        // Set profile privacy toggle
        const toggle = document.getElementById('profile-privacy-toggle');
        toggle.checked = this.currentUser.isPublic;
    }

    showUnauthenticatedUI() {
        document.getElementById('login-link').style.display = 'inline';
        document.getElementById('signup-link').style.display = 'inline';
        document.getElementById('browse-link').style.display = 'none';
        document.getElementById('profile-link').style.display = 'none';
        document.getElementById('friends-link').style.display = 'none';
        document.getElementById('swaps-link').style.display = 'none';
        document.getElementById('logout-link').style.display = 'none';
    }

    async handleSignup(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = {
            username: document.getElementById('signup-username').value,
            password: document.getElementById('signup-password').value,
            name: document.getElementById('signup-name').value,
            email: document.getElementById('signup-email').value,
            location: document.getElementById('signup-location').value || '',
            profilePic: null,
            isPublic: true,
            createdAt: new Date().toISOString()
        };

        // Validate username uniqueness
        if (this.users.find(u => u.username === userData.username)) {
            this.showNotification('Username already exists!', 'error');
            return;
        }

        // Handle profile picture
        const profilePicFile = document.getElementById('signup-profile-pic').files[0];
        if (profilePicFile) {
            userData.profilePic = await this.convertFileToBase64(profilePicFile);
        }

        // Add user
        this.users.push(userData);
        localStorage.setItem('users', JSON.stringify(this.users));

        // Auto login
        this.loginUser(userData);
        this.showNotification('Account created successfully!', 'success');
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const user = this.users.find(u => u.username === username && u.password === password);
        
        if (user) {
            this.loginUser(user);
            this.showNotification('Login successful!', 'success');
        } else {
            this.showNotification('Invalid username or password!', 'error');
        }
    }

    loginUser(user) {
        const sessionId = this.generateSessionId();
        this.sessions[sessionId] = user;
        localStorage.setItem('sessions', JSON.stringify(this.sessions));
        localStorage.setItem('currentSession', sessionId);
        
        this.currentUser = user;
        this.showAuthenticatedUI();
        this.showSection('dashboard');
        this.loadDashboard();
    }

    logout() {
        const sessionId = localStorage.getItem('currentSession');
        if (sessionId) {
            delete this.sessions[sessionId];
            localStorage.setItem('sessions', JSON.stringify(this.sessions));
            localStorage.removeItem('currentSession');
        }
        
        this.currentUser = null;
        this.showUnauthenticatedUI();
        this.showSection('welcome');
        this.showNotification('Logged out successfully!', 'success');
    }

    // UI Navigation Methods
    showSection(sectionName) {
        // Hide all sections
        document.getElementById('welcome-section').style.display = 'none';
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('dashboard-section').style.display = 'none';
        document.getElementById('browse-section').style.display = 'none';
        document.getElementById('swaps-section').style.display = 'none';
        document.getElementById('profile-section').style.display = 'none';

        // Show requested section
        switch (sectionName) {
            case 'welcome':
                document.getElementById('welcome-section').style.display = 'block';
                this.loadWelcomePage();
                break;
            case 'auth':
                document.getElementById('auth-section').style.display = 'block';
                this.switchAuthForm('login');
                break;
            case 'dashboard':
                document.getElementById('dashboard-section').style.display = 'block';
                this.loadDashboard();
                break;
            case 'browse':
                document.getElementById('browse-section').style.display = 'block';
                this.loadBrowseSkills();
                break;
            case 'swaps':
                document.getElementById('swaps-section').style.display = 'block';
                this.loadSwaps();
                break;
            case 'profile':
                document.getElementById('profile-section').style.display = 'block';
                this.loadProfile();
                break;
        }
    }

    switchAuthForm(type) {
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        
        if (type === 'signup') {
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
        } else {
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
        }
    }

    // Browse Skills Methods
    loadBrowseSkills() {
        this.searchSkills();
    }

    searchSkills() {
        const query = document.getElementById('skill-search').value.toLowerCase();
        const availabilityFilter = document.getElementById('availability-filter').value;
        const levelFilter = document.getElementById('level-filter').value;

        const results = [];
        
        this.users.forEach(user => {
            if (user.username === this.currentUser.username || !user.isPublic) return;
            
            const userSkills = this.skills[user.username]?.offered || [];
            const userAvailability = this.availability[user.username] || [];

            userSkills.forEach(skill => {
                const matchesQuery = !query || skill.name.toLowerCase().includes(query);
                const matchesLevel = !levelFilter || skill.level === levelFilter;
                const matchesAvailability = !availabilityFilter || userAvailability.includes(availabilityFilter);

                if (matchesQuery && matchesLevel && matchesAvailability) {
                    results.push({
                        user: user,
                        skill: skill,
                        availability: userAvailability
                    });
                }
            });
        });

        this.displaySkillResults(results);
    }

    displaySkillResults(results) {
        const container = document.getElementById('browse-results');
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <i class="fas fa-search"></i>
                    <p>No skills found matching your criteria.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = results.map(result => `
            <div class="skill-result-card">
                <div class="skill-result-header">
                    <div class="skill-user-avatar">
                        ${result.user.profilePic ? 
                            `<img src="${result.user.profilePic}" alt="${result.user.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">` :
                            result.user.name.charAt(0).toUpperCase()
                        }
                    </div>
                    <div class="skill-user-info">
                        <h4>${result.user.name}</h4>
                        <p>@${result.user.username}</p>
                        ${result.user.location ? `<small>${result.user.location}</small>` : ''}
                    </div>
                </div>
                <div class="skill-details">
                    <h5>${result.skill.name}</h5>
                    <p>${result.skill.description || 'No description provided'}</p>
                </div>
                <div class="skill-meta">
                    <span>Level: ${result.skill.level}</span>
                    ${result.availability.length > 0 ? 
                        `<span>Available: ${result.availability.join(', ')}</span>` : 
                        '<span>No availability set</span>'
                    }
                </div>
                <div class="skill-actions">
                    ${!this.isFriend(result.user.username) ? 
                        `<button class="btn btn-small" onclick="app.addFriend('${result.user.username}')">Add Friend</button>` : 
                        '<button class="btn btn-small" disabled>Already Friends</button>'
                    }
                    <button class="btn btn-primary btn-small" onclick="app.requestSwap('${result.user.username}', '${result.skill.name}')">
                        Request Swap
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Profile Methods
    loadProfile() {
        if (!this.currentUser) return;
        
        this.loadProfileInfo();
        this.loadProfileStats();
        this.loadProfileSkills();
        this.loadProfileAvailability();
    }

    loadProfileInfo() {
        // Load profile avatar
        const avatarContainer = document.getElementById('profile-avatar');
        if (this.currentUser.profilePic) {
            avatarContainer.innerHTML = `<img src="${this.currentUser.profilePic}" alt="${this.currentUser.name}">`;
        } else {
            avatarContainer.textContent = this.currentUser.name.charAt(0).toUpperCase();
        }

        // Load profile info
        document.getElementById('profile-name').textContent = this.currentUser.name;
        document.getElementById('profile-username').textContent = `@${this.currentUser.username}`;
        document.getElementById('profile-location').textContent = this.currentUser.location || 'No location set';
        document.getElementById('profile-email').textContent = this.currentUser.email;

        // Set privacy toggle
        const toggle = document.getElementById('profile-privacy-toggle');
        toggle.checked = this.currentUser.isPublic;
    }

    loadProfileStats() {
        const userSkills = this.skills[this.currentUser.username] || {};
        const userFriends = this.getUserFriends();
        const acceptedSwaps = this.swapRequests[this.currentUser.username]?.filter(swap => swap.status === 'accepted') || [];

        document.getElementById('skills-offered-count').textContent = userSkills.offered?.length || 0;
        document.getElementById('skills-wanted-count').textContent = userSkills.wanted?.length || 0;
        document.getElementById('friends-count').textContent = userFriends.length;
        document.getElementById('swaps-count').textContent = acceptedSwaps.length;
    }

    loadProfileSkills() {
        // Load skills for profile page specifically
        this.loadProfileSkillsOffered();
        this.loadProfileSkillsWanted();
    }

    loadProfileSkillsOffered() {
        const container = document.getElementById('skills-offered-list');
        if (container) {
            this.loadSkillsList(container, 'offered');
        }
    }

    loadProfileSkillsWanted() {
        const container = document.getElementById('skills-wanted-list');
        if (container) {
            this.loadSkillsList(container, 'wanted');
        }
    }

    loadProfileAvailability() {
        const container = document.getElementById('availability-display');
        const userAvailability = this.availability[this.currentUser.username] || [];
        const notes = this.availability[this.currentUser.username + '_notes'] || '';

        if (userAvailability.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clock"></i>
                    <p>No availability set. Click "Edit" to set your availability.</p>
                </div>
            `;
            return;
        }

        let availabilityHTML = userAvailability.map(avail => 
            `<span class="availability-tag">${avail.charAt(0).toUpperCase() + avail.slice(1)}</span>`
        ).join('');

        if (notes) {
            availabilityHTML += `
                <div class="availability-notes">
                    <p>${notes}</p>
                </div>
            `;
        }

        container.innerHTML = availabilityHTML;
    }

    openEditProfileModal() {
        const modal = document.getElementById('edit-profile-modal');
        
        // Populate form with current user data
        document.getElementById('edit-name').value = this.currentUser.name;
        document.getElementById('edit-email').value = this.currentUser.email;
        document.getElementById('edit-location').value = this.currentUser.location || '';
        document.getElementById('edit-password').value = '';
        document.getElementById('edit-confirm-password').value = '';
        
        modal.style.display = 'flex';
    }

    closeEditProfileModal() {
        document.getElementById('edit-profile-modal').style.display = 'none';
        document.getElementById('edit-profile-form').reset();
    }

    async handleEditProfile(e) {
        e.preventDefault();
        
        const newName = document.getElementById('edit-name').value;
        const newEmail = document.getElementById('edit-email').value;
        const newLocation = document.getElementById('edit-location').value;
        const newPassword = document.getElementById('edit-password').value;
        const confirmPassword = document.getElementById('edit-confirm-password').value;
        const newProfilePic = document.getElementById('edit-profile-pic').files[0];

        // Validate password if provided
        if (newPassword && newPassword !== confirmPassword) {
            this.showNotification('Passwords do not match!', 'error');
            return;
        }

        // Update user data
        this.currentUser.name = newName;
        this.currentUser.email = newEmail;
        this.currentUser.location = newLocation;

        if (newPassword) {
            this.currentUser.password = newPassword;
        }

        if (newProfilePic) {
            this.currentUser.profilePic = await this.convertFileToBase64(newProfilePic);
        }

        // Update user in storage
        const userIndex = this.users.findIndex(u => u.username === this.currentUser.username);
        if (userIndex !== -1) {
            this.users[userIndex] = this.currentUser;
            localStorage.setItem('users', JSON.stringify(this.users));
        }

        // Update session
        const sessionId = localStorage.getItem('currentSession');
        if (sessionId) {
            this.sessions[sessionId] = this.currentUser;
            localStorage.setItem('sessions', JSON.stringify(this.sessions));
        }

        this.closeEditProfileModal();
        this.loadProfile();
        this.showNotification('Profile updated successfully!', 'success');
    }

    // Availability Methods
    openAvailabilityModal() {
        const modal = document.getElementById('availability-modal');
        const userAvailability = this.availability[this.currentUser.username] || [];
        
        // Set current availability
        document.getElementById('avail-weekends').checked = userAvailability.includes('weekends');
        document.getElementById('avail-evenings').checked = userAvailability.includes('evenings');
        document.getElementById('avail-weekdays').checked = userAvailability.includes('weekdays');
        document.getElementById('avail-flexible').checked = userAvailability.includes('flexible');
        
        // Set notes
        const notes = this.availability[this.currentUser.username + '_notes'] || '';
        document.getElementById('availability-notes').value = notes;
        
        modal.style.display = 'flex';
    }

    closeAvailabilityModal() {
        document.getElementById('availability-modal').style.display = 'none';
    }

    handleAvailabilitySubmit(e) {
        e.preventDefault();
        
        const availability = [];
        if (document.getElementById('avail-weekends').checked) availability.push('weekends');
        if (document.getElementById('avail-evenings').checked) availability.push('evenings');
        if (document.getElementById('avail-weekdays').checked) availability.push('weekdays');
        if (document.getElementById('avail-flexible').checked) availability.push('flexible');
        
        const notes = document.getElementById('availability-notes').value;
        
        this.availability[this.currentUser.username] = availability;
        this.availability[this.currentUser.username + '_notes'] = notes;
        
        localStorage.setItem('availability', JSON.stringify(this.availability));
        
        this.closeAvailabilityModal();
        this.loadProfileAvailability();
        this.showNotification('Availability updated successfully!', 'success');
    }

    // Swap Request Methods
    requestSwap(targetUsername, skillName) {
        const userSkills = this.skills[this.currentUser.username]?.offered || [];
        
        if (userSkills.length === 0) {
            this.showNotification('You need to add skills you can offer before requesting swaps!', 'error');
            return;
        }

        // Populate swap request modal
        document.getElementById('swap-skill-name').textContent = skillName;
        document.getElementById('swap-user-name').textContent = `with ${this.users.find(u => u.username === targetUsername)?.name}`;
        
        const skillSelect = document.getElementById('swap-skill-offer');
        skillSelect.innerHTML = '<option value="">Select a skill you can offer</option>';
        userSkills.forEach(skill => {
            skillSelect.innerHTML += `<option value="${skill.name}">${skill.name} (${skill.level})</option>`;
        });

        // Store target info for form submission
        document.getElementById('swap-request-modal').dataset.targetUsername = targetUsername;
        document.getElementById('swap-request-modal').dataset.skillName = skillName;
        
        document.getElementById('swap-request-modal').style.display = 'flex';
    }

    closeSwapModal() {
        document.getElementById('swap-request-modal').style.display = 'none';
        document.getElementById('swap-request-form').reset();
    }

    handleSwapRequest(e) {
        e.preventDefault();
        
        const targetUsername = document.getElementById('swap-request-modal').dataset.targetUsername;
        const skillName = document.getElementById('swap-request-modal').dataset.skillName;
        const message = document.getElementById('swap-message').value;
        const offeredSkill = document.getElementById('swap-skill-offer').value;
        const preferredTime = document.getElementById('swap-preferred-time').value;
        
        if (!offeredSkill) {
            this.showNotification('Please select a skill to offer in exchange!', 'error');
            return;
        }

        const swapRequest = {
            id: this.generateSwapId(),
            fromUser: this.currentUser.username,
            toUser: targetUsername,
            requestedSkill: skillName,
            offeredSkill: offeredSkill,
            message: message,
            preferredTime: preferredTime,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        if (!this.swapRequests[targetUsername]) {
            this.swapRequests[targetUsername] = [];
        }
        this.swapRequests[targetUsername].push(swapRequest);
        
        localStorage.setItem('swapRequests', JSON.stringify(this.swapRequests));
        
        this.closeSwapModal();
        this.showNotification('Swap request sent successfully!', 'success');
    }

    // Swaps Management Methods
    loadSwaps() {
        this.loadPendingSwaps();
        this.loadAcceptedSwaps();
        this.loadSentSwaps();
    }

    switchSwapTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    loadPendingSwaps() {
        const container = document.getElementById('pending-swaps-list');
        const pendingSwaps = this.swapRequests[this.currentUser.username]?.filter(swap => swap.status === 'pending') || [];
        
        if (pendingSwaps.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clock"></i>
                    <p>No pending swap requests.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = pendingSwaps.map(swap => {
            const fromUser = this.users.find(u => u.username === swap.fromUser);
            return `
                <div class="swap-item">
                    <div class="swap-header">
                        <div class="swap-info">
                            <h4>${swap.requestedSkill} ↔ ${swap.offeredSkill}</h4>
                            <p>Request from ${fromUser?.name} (@${swap.fromUser})</p>
                        </div>
                        <span class="swap-status pending">Pending</span>
                    </div>
                    <div class="swap-details">
                        <p><strong>Message:</strong> ${swap.message}</p>
                        ${swap.preferredTime ? `<p><strong>Preferred Time:</strong> ${swap.preferredTime}</p>` : ''}
                        <p><strong>Requested:</strong> ${new Date(swap.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div class="swap-actions">
                        <button class="btn btn-success btn-small" onclick="app.acceptSwap('${swap.id}')">
                            Accept
                        </button>
                        <button class="btn btn-danger btn-small" onclick="app.rejectSwap('${swap.id}')">
                            Reject
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    loadAcceptedSwaps() {
        const container = document.getElementById('accepted-swaps-list');
        const acceptedSwaps = this.swapRequests[this.currentUser.username]?.filter(swap => swap.status === 'accepted') || [];
        
        if (acceptedSwaps.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-check-circle"></i>
                    <p>No accepted swaps yet.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = acceptedSwaps.map(swap => {
            const fromUser = this.users.find(u => u.username === swap.fromUser);
            return `
                <div class="swap-item">
                    <div class="swap-header">
                        <div class="swap-info">
                            <h4>${swap.requestedSkill} ↔ ${swap.offeredSkill}</h4>
                            <p>${swap.fromUser === this.currentUser.username ? 
                                `Teaching ${fromUser?.name} (@${swap.fromUser})` : 
                                `Learning from ${fromUser?.name} (@${swap.fromUser})`
                            }</p>
                        </div>
                        <span class="swap-status accepted">Accepted</span>
                    </div>
                    <div class="swap-details">
                        <p><strong>Message:</strong> ${swap.message}</p>
                        ${swap.preferredTime ? `<p><strong>Preferred Time:</strong> ${swap.preferredTime}</p>` : ''}
                        <p><strong>Accepted:</strong> ${new Date(swap.acceptedAt || swap.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    loadSentSwaps() {
        const container = document.getElementById('sent-swaps-list');
        const sentSwaps = [];
        
        // Find all swaps sent by current user
        Object.keys(this.swapRequests).forEach(username => {
            const userSwaps = this.swapRequests[username].filter(swap => swap.fromUser === this.currentUser.username);
            sentSwaps.push(...userSwaps);
        });
        
        if (sentSwaps.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-paper-plane"></i>
                    <p>No sent swap requests yet.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = sentSwaps.map(swap => {
            const toUser = this.users.find(u => u.username === swap.toUser);
            return `
                <div class="swap-item">
                    <div class="swap-header">
                        <div class="swap-info">
                            <h4>${swap.requestedSkill} ↔ ${swap.offeredSkill}</h4>
                            <p>Request to ${toUser?.name} (@${swap.toUser})</p>
                        </div>
                        <span class="swap-status ${swap.status}">${swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}</span>
                    </div>
                    <div class="swap-details">
                        <p><strong>Message:</strong> ${swap.message}</p>
                        ${swap.preferredTime ? `<p><strong>Preferred Time:</strong> ${swap.preferredTime}</p>` : ''}
                        <p><strong>Sent:</strong> ${new Date(swap.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div class="swap-actions">
                        ${swap.status === 'pending' ? 
                            `<button class="btn btn-danger btn-small" onclick="app.deleteSwap('${swap.id}')">Delete Request</button>` : 
                            ''
                        }
                    </div>
                </div>
            `;
        }).join('');
    }

    acceptSwap(swapId) {
        const swap = this.findSwapById(swapId);
        if (swap) {
            swap.status = 'accepted';
            swap.acceptedAt = new Date().toISOString();
            localStorage.setItem('swapRequests', JSON.stringify(this.swapRequests));
            this.loadSwaps();
            this.showNotification('Swap request accepted!', 'success');
        }
    }

    rejectSwap(swapId) {
        const swap = this.findSwapById(swapId);
        if (swap) {
            swap.status = 'rejected';
            swap.rejectedAt = new Date().toISOString();
            localStorage.setItem('swapRequests', JSON.stringify(this.swapRequests));
            this.loadSwaps();
            this.showNotification('Swap request rejected.', 'info');
        }
    }

    deleteSwap(swapId) {
        if (confirm('Are you sure you want to delete this swap request?')) {
            // Remove from all users' swap requests
            Object.keys(this.swapRequests).forEach(username => {
                this.swapRequests[username] = this.swapRequests[username].filter(swap => swap.id !== swapId);
            });
            localStorage.setItem('swapRequests', JSON.stringify(this.swapRequests));
            this.loadSwaps();
            this.showNotification('Swap request deleted.', 'success');
        }
    }

    findSwapById(swapId) {
        for (const username in this.swapRequests) {
            const swap = this.swapRequests[username].find(s => s.id === swapId);
            if (swap) return swap;
        }
        return null;
    }

    // Dashboard Methods
    loadDashboard() {
        if (!this.currentUser) return;
        
        this.loadSkillsOffered();
        this.loadSkillsWanted();
        this.loadFriends();
        this.loadMatches();
    }

    loadSkillsOffered() {
        // Load for dashboard
        const dashboardContainer = document.getElementById('dashboard-skills-offered-list');
        if (dashboardContainer) {
            this.loadSkillsList(dashboardContainer, 'offered');
        }
        
        // Load for profile
        const profileContainer = document.getElementById('skills-offered-list');
        if (profileContainer) {
            this.loadSkillsList(profileContainer, 'offered');
        }
    }

    loadSkillsWanted() {
        // Load for dashboard
        const dashboardContainer = document.getElementById('dashboard-skills-wanted-list');
        if (dashboardContainer) {
            this.loadSkillsList(dashboardContainer, 'wanted');
        }
        
        // Load for profile
        const profileContainer = document.getElementById('skills-wanted-list');
        if (profileContainer) {
            this.loadSkillsList(profileContainer, 'wanted');
        }
    }

    loadSkillsList(container, type) {
        const userSkills = this.skills[this.currentUser.username]?.[type] || [];
        
        if (userSkills.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-${type === 'offered' ? 'gift' : 'search'}"></i>
                    <p>No skills ${type === 'offered' ? 'offered' : 'wanted'} yet. Add your first skill!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = userSkills.map(skill => `
            <div class="skill-item">
                <div class="skill-info">
                    <h4>${skill.name}</h4>
                    <p>${skill.description || 'No description'}</p>
                    <small>Level: ${skill.level}</small>
                </div>
                <div class="skill-actions">
                    <button class="btn-remove" onclick="app.removeSkill('${type}', '${skill.name}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadFriends() {
        const container = document.getElementById('friends-list');
        const userFriends = this.getUserFriends();
        
        if (userFriends.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <p>No friends yet. Find and connect with other users!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = userFriends.map(friend => `
            <div class="friend-item">
                <div class="friend-info">
                    <div class="friend-avatar">
                        ${friend.profilePic ? 
                            `<img src="${friend.profilePic}" alt="${friend.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">` :
                            friend.name.charAt(0).toUpperCase()
                        }
                    </div>
                    <div class="friend-details">
                        <h4>${friend.name}</h4>
                        <p>@${friend.username}</p>
                        ${friend.location ? `<small>${friend.location}</small>` : ''}
                    </div>
                </div>
                <button class="btn-remove" onclick="app.removeFriend('${friend.username}')">
                    <i class="fas fa-user-minus"></i>
                </button>
            </div>
        `).join('');
    }

    loadMatches() {
        const container = document.getElementById('matches-list');
        const matches = this.findSkillMatches();
        
        if (matches.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-handshake"></i>
                    <p>No skill matches found. Add more skills to find matches!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = matches.map(match => `
            <div class="match-item">
                <h4>${match.user.name} can help with ${match.skill}</h4>
                <p>You want to learn ${match.skill} and ${match.user.name} offers it at ${match.level} level.</p>
                ${!this.isFriend(match.user.username) ? 
                    `<button class="btn btn-small" onclick="app.addFriend('${match.user.username}')">Add Friend</button>` : 
                    '<small>Already friends</small>'
                }
            </div>
        `).join('');
    }

    // Skill Management Methods
    openSkillModal(type) {
        const modal = document.getElementById('add-skill-modal');
        const title = document.getElementById('modal-title');
        
        title.textContent = `Add Skill ${type === 'offered' ? 'I Offer' : 'I Want'}`;
        modal.dataset.skillType = type;
        modal.style.display = 'flex';
    }

    closeSkillModal() {
        document.getElementById('add-skill-modal').style.display = 'none';
        document.getElementById('add-skill-form').reset();
    }

    handleAddSkill(e) {
        e.preventDefault();
        
        const type = document.getElementById('add-skill-modal').dataset.skillType;
        const skillData = {
            name: document.getElementById('skill-name').value,
            description: document.getElementById('skill-description').value,
            level: document.getElementById('skill-level').value
        };

        if (!this.skills[this.currentUser.username]) {
            this.skills[this.currentUser.username] = { offered: [], wanted: [] };
        }

        this.skills[this.currentUser.username][type].push(skillData);
        localStorage.setItem('skills', JSON.stringify(this.skills));

        this.closeSkillModal();
        
        // Refresh both dashboard and profile views
        this.loadSkillsOffered();
        this.loadSkillsWanted();
        this.loadProfileStats();
        
        this.showNotification(`Skill "${skillData.name}" added successfully!`, 'success');
    }

    getCurrentSection() {
        if (document.getElementById('dashboard-section').style.display !== 'none') return 'dashboard';
        if (document.getElementById('profile-section').style.display !== 'none') return 'profile';
        if (document.getElementById('browse-section').style.display !== 'none') return 'browse';
        if (document.getElementById('swaps-section').style.display !== 'none') return 'swaps';
        if (document.getElementById('auth-section').style.display !== 'none') return 'auth';
        return 'welcome';
    }

    removeSkill(type, skillName) {
        if (confirm(`Are you sure you want to remove "${skillName}"?`)) {
            const userSkills = this.skills[this.currentUser.username];
            if (userSkills && userSkills[type]) {
                userSkills[type] = userSkills[type].filter(skill => skill.name !== skillName);
                localStorage.setItem('skills', JSON.stringify(this.skills));
                
                // Refresh both dashboard and profile views
                this.loadSkillsOffered();
                this.loadSkillsWanted();
                this.loadProfileStats();
                
                this.showNotification(`Skill "${skillName}" removed!`, 'success');
            }
        }
    }

    // Friends Management Methods
    openFriendsModal() {
        document.getElementById('find-friends-modal').style.display = 'flex';
    }

    closeFriendsModal() {
        document.getElementById('find-friends-modal').style.display = 'none';
        document.getElementById('friend-search').value = '';
        document.getElementById('search-results').innerHTML = '';
    }

    searchFriends() {
        const query = document.getElementById('friend-search').value.toLowerCase();
        const results = this.users.filter(user => 
            user.username !== this.currentUser.username &&
            (user.name.toLowerCase().includes(query) || user.username.toLowerCase().includes(query))
        );

        const container = document.getElementById('search-results');
        
        if (results.length === 0) {
            container.innerHTML = '<p>No users found.</p>';
            return;
        }

        container.innerHTML = results.map(user => `
            <div class="search-result-item">
                <div class="friend-info">
                    <div class="friend-avatar">
                        ${user.profilePic ? 
                            `<img src="${user.profilePic}" alt="${user.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">` :
                            user.name.charAt(0).toUpperCase()
                        }
                    </div>
                    <div class="friend-details">
                        <h4>${user.name}</h4>
                        <p>@${user.username}</p>
                        ${user.location ? `<small>${user.location}</small>` : ''}
                    </div>
                </div>
                ${this.isFriend(user.username) ? 
                    '<button class="btn btn-small" disabled>Already Friends</button>' :
                    '<button class="btn btn-small" onclick="app.addFriend(\'' + user.username + '\')">Add Friend</button>'
                }
            </div>
        `).join('');
    }

    addFriend(friendUsername) {
        if (!this.friendships[this.currentUser.username]) {
            this.friendships[this.currentUser.username] = [];
        }
        
        if (!this.friendships[this.currentUser.username].includes(friendUsername)) {
            this.friendships[this.currentUser.username].push(friendUsername);
            localStorage.setItem('friendships', JSON.stringify(this.friendships));
            
            this.loadDashboard();
            this.closeFriendsModal();
            this.showNotification('Friend added successfully!', 'success');
        }
    }

    removeFriend(friendUsername) {
        if (confirm('Are you sure you want to remove this friend?')) {
            if (this.friendships[this.currentUser.username]) {
                this.friendships[this.currentUser.username] = this.friendships[this.currentUser.username]
                    .filter(username => username !== friendUsername);
                localStorage.setItem('friendships', JSON.stringify(this.friendships));
                this.loadDashboard();
                this.showNotification('Friend removed!', 'success');
            }
        }
    }

    getUserFriends() {
        const friendUsernames = this.friendships[this.currentUser.username] || [];
        return this.users.filter(user => friendUsernames.includes(user.username));
    }

    isFriend(username) {
        const friends = this.friendships[this.currentUser.username] || [];
        return friends.includes(username);
    }

    // Profile Privacy Methods
    toggleProfilePrivacy(e) {
        this.currentUser.isPublic = e.target.checked;
        
        // Update user in storage
        const userIndex = this.users.findIndex(u => u.username === this.currentUser.username);
        if (userIndex !== -1) {
            this.users[userIndex] = this.currentUser;
            localStorage.setItem('users', JSON.stringify(this.users));
        }
        
        this.showNotification(
            `Profile is now ${this.currentUser.isPublic ? 'public' : 'private'}!`, 
            'success'
        );
    }

    // Skill Matching Methods
    findSkillMatches() {
        const matches = [];
        const currentUserSkills = this.skills[this.currentUser.username] || {};
        const wantedSkills = currentUserSkills.wanted || [];

        this.users.forEach(user => {
            if (user.username === this.currentUser.username || !user.isPublic) return;
            
            const userSkills = this.skills[user.username] || {};
            const offeredSkills = userSkills.offered || [];

            wantedSkills.forEach(wantedSkill => {
                const match = offeredSkills.find(offeredSkill => 
                    offeredSkill.name.toLowerCase() === wantedSkill.name.toLowerCase()
                );
                
                if (match) {
                    matches.push({
                        user: user,
                        skill: wantedSkill.name,
                        level: match.level
                    });
                }
            });
        });

        return matches;
    }

    // Utility Methods
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateSwapId() {
        return 'swap_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 3000;
            display: flex;
            align-items: center;
            gap: 1rem;
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.querySelector('button').style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    loadWelcomePage() {
        const hero = document.querySelector('.hero');
        
        if (this.currentUser) {
            // User is logged in - show personalized welcome
            hero.innerHTML = `
                <h1>Welcome back, ${this.currentUser.name}!</h1>
                <p>Ready to continue your skill exchange journey? Browse skills, manage your swaps, or update your profile.</p>
                <div class="hero-buttons">
                    <button class="btn btn-primary" onclick="app.showSection('browse')">
                        <i class="fas fa-search"></i> Browse Skills
                    </button>
                    <button class="btn btn-secondary" onclick="app.showSection('dashboard')">
                        <i class="fas fa-tachometer-alt"></i> Go to Dashboard
                    </button>
                    <button class="btn btn-secondary" onclick="app.showSection('profile')">
                        <i class="fas fa-user"></i> My Profile
                    </button>
                </div>
            `;
        } else {
            // User is not logged in - show original welcome
            hero.innerHTML = `
                <h1>Welcome to SkillSwap</h1>
                <p>Connect with people who have the skills you need and share your expertise with others.</p>
                <div class="hero-buttons">
                    <button class="btn btn-primary" id="get-started-btn">Get Started</button>
                    <button class="btn btn-secondary" id="learn-more-btn">Learn More</button>
                </div>
            `;
            
            // Re-attach event listeners for the new buttons
            document.getElementById('get-started-btn').addEventListener('click', () => this.showSection('auth'));
            document.getElementById('learn-more-btn').addEventListener('click', () => this.showLearnMore());
        }
    }

    showLearnMore() {
        this.showNotification('SkillSwap helps you connect with people who have the skills you need and share your expertise with others. Create an account to get started!', 'info');
    }

    toggleMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        navMenu.classList.toggle('active');
    }
}

// Add notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize the app
const app = new SkillSwapApp(); 
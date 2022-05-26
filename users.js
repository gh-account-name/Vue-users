const Users={
    data(){
        return{
            users:[],
            selectedUser: '',
            inputPages: [],
            currentInputPage: 0,
            userNameInput: '',
            userLoginInput: '',
            userEmailInput:'',
            userPhoneNumberInput: '',
            userSiteInput:'',
            userCityInput:'',
            userStreetInput:'',
            userSuiteInput:'',
            userZipcodeInput:'',
            userLatInput:'',
            userLngInput:'',
            userCompanyNameInput: '',
            userCompanyCatchPhraseInput:'',
            userBusinessInput:'',
            inputs:[],
            validateInputsCount:0,
            sortOptions: [
                {value:'', name: "Без сортировки"},
                {value:'username', name:'По логину'},
                {value:'name', name:"По имени"},
                {value: 'email', name:'По эл. почте'}
            ],
            selectedOption:'',
            searchValue:'',
            filterOptions:[
                {value:'', name:"Все"},
                {value:'.ru', name:"ru"},
                {value:'.com', name:"com"},
                {value:'.net', name:"net"},
            ],
            selectedFilterOption: '',
            reverseChecked: false,
        }
    },
    methods:{
        async getUserData(){
            this.users = await (await fetch('https://jsonplaceholder.typicode.com/users')).json();
            this.setSelectedUser(this.users[0]);
        },
        showDetailCard(user){
            this.selectedUser=user;
            document.querySelector('.blackBackground:last-of-type').style.top = `${window.pageYOffset}px`;
            document.querySelector('.blackBackground:last-of-type').style.display = 'flex';
            document.body.style.overflow = 'hidden';
        },
        hideDetailCard(){
            document.querySelector('.blackBackground:last-of-type').style.display = 'none';
            document.body.style.overflow = 'auto';
        },
        setSelectedUser(value){
            this.selectedUser = value;
        },
        showAddUserForm(){
            document.querySelector('.blackBackground:first-of-type').style.top = `${window.pageYOffset}px`;
            document.querySelector('.blackBackground:first-of-type').style.display = 'flex';
            document.body.style.overflow = 'hidden';
        },
        closeAddUserForm(){
            document.querySelector('.blackBackground:first-of-type').style.display = 'none';
            document.body.style.overflow = 'auto';
        },
        deleteUser(user){
            this.users = this.users.filter(elem=>elem.id!=user.id)
        },
        setInputPages(){
            this.inputPages = document.querySelectorAll('.addUserForm>div');
        },
        nextInputPage(){
            this.inputPages[this.currentInputPage].classList.remove('shown');
            this.currentInputPage++;
            this.inputPages[this.currentInputPage].classList.add('shown');
            if (this.currentInputPage == this.inputPages.length-1){
                document.querySelector('#movingButtons button:last-of-type').disabled = true;
            } 
            if (this.currentInputPage > 0){
                document.querySelector('#movingButtons button:first-of-type').disabled = false;
            }
        },
        previousInputPage(){
            this.inputPages[this.currentInputPage].classList.remove('shown');
            this.currentInputPage--;
            this.inputPages[this.currentInputPage].classList.add('shown');
            if (this.currentInputPage == 0){
                document.querySelector('#movingButtons button:first-of-type').disabled = true;
            } 
            if (this.currentInputPage > 0){
                document.querySelector('#movingButtons button:last-of-type').disabled = false;
            }
        },
        setInputsData(){
            this.inputs = document.querySelectorAll('.addUserForm input');
        },
        validate(id, regexp){
            if (regexp.test(this[id].trim())){
                document.getElementById(id).classList.remove('requiredInput');
                document.getElementById(id).classList.add('validate');
            } else{
                document.getElementById(id).classList.add('requiredInput');
                document.getElementById(id).classList.remove('validate');
            }
            if (this[id]==''){
                document.getElementById(id).classList.remove('requiredInput');
            }
            this.validateInputsCount=0;
            this.setInputsData();
        },
        addUser(){
            let newUser={
                "id": String(Date.now()).slice(-6),
                "name": this.userNameInput.trim(),
                "username": this.userLoginInput.trim(),
                "email": this.userEmailInput.trim(),
                "address": {
                  "street": this.userStreetInput.trim(),
                  "suite": this.userSuiteInput.trim(),
                  "city": this.userCityInput.trim(),
                  "zipcode": this.userZipcodeInput.trim(),
                  "geo": {
                    "lat": this.userLatInput.trim(),
                    "lng": this.userLngInput.trim()
                  }
                },
                "phone": this.userPhoneNumberInput.trim(),
                "website": this.userSiteInput.trim(),
                "company": {
                  "name": this.userCompanyNameInput.trim(),
                  "catchPhrase": this.userCompanyCatchPhraseInput.trim(),
                  "bs": this.userBusinessInput.trim()
                }
            };
            this.users.unshift(newUser);
            this.clearAddUserForm();
            this.closeAddUserForm();
        },
        clearAddUserForm(){
            this.inputPages[this.currentInputPage].classList.remove('shown');
            this.currentInputPage=0;
            this.inputPages[this.currentInputPage].classList.add('shown');
            this.inputs.forEach(input=>{
                this[input.id]='';
            });
        },
        changeCheckbox(){
            this.reverseChecked=!this.reverseChecked;
        },
    },
    mounted(){
        this.getUserData();
        this.setInputPages();
    },
    computed:{
        sortUsers(){
            return [...this.users].sort((user1,user2)=>user1[this.selectedOption]?.localeCompare(user2[this.selectedOption]))
        },
        sortAndSearch(){
            return this.sortUsers.filter(user=>{
                if (user.name.toLowerCase().includes(this.searchValue.toLowerCase()) || String(user.id).includes(this.searchValue.toLowerCase()) || user.company.name.toLowerCase().includes(this.searchValue.toLowerCase())){
                    return true
                } 
            })
        },
        filterDomains(){
            return this.sortAndSearch.filter(user=>{
                if (user.website.includes(this.selectedFilterOption)){
                    return true
                }
            })
        },
        reverseSortAndSearch(){
            if (this.reverseChecked) {
                return [...this.filterDomains].reverse()
            } else {
                return this.filterDomains
            }
        }
    },
    watch:{
        inputs(){
            this.inputs.forEach(input => {
                if (input.classList.contains('validate')){
                    this.validateInputsCount++
                }
            });
        },
        validateInputsCount(){
            if (this.validateInputsCount==this.inputs.length){
                document.getElementById('addUserButton').disabled=false;
            } else {
                document.getElementById('addUserButton').disabled=true;
            }
        },
        userNameInput(){
            this.validate('userNameInput', /^((([A-Z]|[А-Я])([a-z]|[а-я])+ ([A-Z]|[А-Я])([a-z]|[а-я])+)|(([A-Z]|[А-Я])([a-z]|[а-я])+ ([A-Z]|[А-Я])([a-z]|[а-я])+ ([A-Z]|[А-Я])([a-z]|[а-я])+))$/)
        },
        userLoginInput(){
            this.validate('userLoginInput', /(\w|[а-я]|[А-Я])+/)
        },
        userEmailInput(){
            this.validate('userEmailInput', /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)
        },
        userPhoneNumberInput(){
            this.validate('userPhoneNumberInput', /^(\+\s?7|8)(\s?9\d{2}\s?|\s?\(9\d{2}\)\s?)(\d{7}|\d{3}\s\d{2}\s\d{2}|\d{3}\-\d{2}\-\d{2}|\d{3}\s\-\s\d{2}\s\-\s\d{2})$/)
        },
        userSiteInput(){
            this.validate('userSiteInput', /^\w+.(ru|net|com)$/)
        },
        userCityInput(){
            this.validate('userCityInput', /(\w|[а-я]|[А-Я])+/)
        },
        userStreetInput(){
            this.validate('userStreetInput', /(\w|[а-я]|[А-Я])+/)
        },
        userSuiteInput(){
            this.validate('userSuiteInput', /(\w|[а-я]|[А-Я])+/)
        },
        userZipcodeInput(){
            this.validate('userZipcodeInput', /(\w|[а-я]|[А-Я])+/)
        },
        userLatInput(){
            this.validate('userLatInput', /(\w|[а-я]|[А-Я])+/)
        },
        userLngInput(){
            this.validate('userLngInput', /(\w|[а-я]|[А-Я])+/)
        },
        userCompanyNameInput(){
            this.validate('userCompanyNameInput', /(\w|[а-я]|[А-Я])+/)
        },
        userCompanyCatchPhraseInput(){
            this.validate('userCompanyCatchPhraseInput', /(\w|[а-я]|[А-Я])+/)
        },
        userBusinessInput(){
            this.validate('userBusinessInput', /(\w|[а-я]|[А-Я])+/)
        },
    }
}

Vue.createApp(Users).mount('body')
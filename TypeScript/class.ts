
// ES6 class-base OOP

class Student {
	fullname : string;
	
	// sugar: public on arguments of constructor 
	// shorthand allowing automatically create properties
	constructor(public firstname : string, 
		public middleinitial : string, public lastname : string) {
		this.fullname = firstname + " " + middleinitial + " " + lastname;
	}
}

//  two types are compatible if their 
// internal structure is compatible
interface Person {
	firstname : string;
	lastname : string;
}

var user_d = {
	firstname: "Jane",
	lastname: "User"
};

function greeter(person : Person) {
	return 'Hello, ' + person.firstname + ' ' + person.lastname;
}

var user = new Student("Jane", "M.", "User");

document.body.innerHTML = greeter(user_d);
document.body.innerHTML = greeter(user);
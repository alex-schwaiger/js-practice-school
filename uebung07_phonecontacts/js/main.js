/*
Project: Classes - Bank Accounts
Author:  Alexander Schwaiger
Date:    11/13/2023
*/

'use strict';

const appName = 'Bankkonten';
document.getElementById('myTitle').innerText = appName;
document.getElementById('myHeading1').innerText = appName;

const outputInfos = document.getElementById('outputInfos');

const findContactsWithMostCalls = (phoneContacts) => {
  let maxCalls = 0;

  phoneContacts.forEach((phoneContact) => {
    if (phoneContact.numberOfCalls > maxCalls) {
      maxCalls = phoneContact.numberOfCalls;
    }
  });

  return phoneContacts.filter(
    (phoneContact) => phoneContact.numberOfCalls === maxCalls
  );
};

class PhoneContact {
  static id = 0;

  constructor(firstName, lastName, contactType, telephoneNumber) {
    this.id = ++PhoneContact.id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.contactType = contactType;
    this.telephoneNumber = telephoneNumber;
    this.minutes = 0;
    this.numberOfCalls = 0;
  }

  getInfo() {
    return `<div><strong>Vorname:</strong> ${this.firstName} </div> <div><strong>Nachname:</strong> ${this.lastName}</div> <div><strong>KontaktTyp:</strong> ${this.contactType}</div> <div><strong> Telefonnummer:</strong> ${this.telephoneNumber}</div> <div><strong> Minuten:</strong> ${this.minutes}</div><div><strong> Anzahl der Anrufe:</strong> ${this.numberOfCalls}</div>`;
  }

  call(minutes) {
    if (minutes > 0) {
      this.minutes += minutes;
      this.numberOfCalls++;
    }
  }

  resetMinutes() {
    this.minutes = 0;
  }

  resetCalls() {
    this.numberOfCalls = 0;
  }

  avgMinutesPerCall() {
    return this.numberOfCalls > 0 ? this.minutes / this.numberOfCalls : 0;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

const phoneContactsData = new Map();

const contactsBook = () => {
  const select = document.getElementById('contactsList');

  select.innerHTML = '';

  [...phoneContactsData.values()].forEach((contact) => {
    const option = document.createElement('option');
    option.value = contact.id;
    option.text = contact.getFullName();
    select.appendChild(option);
  });
};

document
  .getElementById('telephoneContactForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const dataArray = [];
    for (const [_, value] of data.entries()) {
      dataArray.push(value);
    }
    const phoneContact = new PhoneContact(...dataArray);
    phoneContactsData.set(phoneContact.id, phoneContact);
    console.log(phoneContactsData);
    contactsBook();
    event.target.reset();
  });

document
  .getElementById('callForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    const id = +event.target.contactsList.value;
    const minutes = +event.target.callMinutes.value;
    const phoneContact = phoneContactsData.get(id);
    phoneContact.call(minutes);
    console.log(phoneContactsData);
    event.target.reset();
  });
console.log(phoneContactsData);

document.getElementById('showAllContacts').addEventListener('click', () => {
  outputInfos.innerHTML = '';
  [...phoneContactsData.values()].forEach((phoneContact) => {
    outputInfos.innerHTML += phoneContact.getInfo();
  });
});

document
  .getElementById('searchContactByLastName')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    const lastName = event.target.contactLastName.value;
    const phoneContacts = [...phoneContactsData.values()].filter(
      (phoneContact) => phoneContact.lastName === lastName
    );
    console.log(phoneContacts);
    outputInfos.innerHTML = '';
    phoneContacts.forEach((phoneContact) => {
      outputInfos.innerHTML += phoneContact.getInfo();
    });
    event.target.reset();
  });

document
  .getElementById('deleteContactForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    const id = +event.target.deleteContactId.value;
    const confirmDelete = confirm('Wollen Sie den Kontakt wirklich löschen?');
    if (confirmDelete) {
      phoneContactsData.delete(id);
    }
    event.target.reset();
  });

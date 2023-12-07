/*
Project: Classes - Bank Accounts
Author:  Schwaiger Alexander
Date:    11/06/2023
*/

'use strict';

const appName = 'Bankkonten';
document.getElementById('myTitle').innerText = appName;
document.getElementById('myHeading1').innerText = appName;

const btnAddCustomer = document.getElementById('btnAddCustomer');
// TODO: import missing Buttons
const btnShowCustomerInfos = document.getElementById('btnShowCustomerInfos');

const outputInfos = document.getElementById('outputInfos');

const errorMessage = (info) => {
  const errorDiv = document.getElementById('error-field');
  const errorContent = document.getElementById('error-info');
  errorContent.textContent = info;
  errorDiv.style.display = 'block';

  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 5000);
};

const successMessage = (info) => {
  const successDiv = document.getElementById('succed-field');
  const successContent = document.getElementById('succed-info');
  successContent.textContent = info;
  successDiv.style.display = 'block';

  setTimeout(() => {
    successDiv.style.display = 'none';
  }, 5000);
};

function increaseAllBalances(amount) {
  [...bankAccountsData.values()].forEach((bankAccount) => {
    bankAccount.deposit(amount);
  });
}

function removeBankAccountsByBankName(bankName) {
  [...bankAccountsData.values()].forEach((bankAccount) => {
    if (bankAccount.bankName === bankName) {
      bankAccountsData.delete(bankAccount.bankNumber);
    }
  });
}

function sortBankAccounts() {
  const bankAccountsArray = [...bankAccountsData.values()];
  bankAccountsArray.sort((a, b) => a.balance - b.balance);
  return bankAccountsArray;
}

// Definition of class BankAccount
class BankAccount {
  #accountNumber;
  #bankName;
  #bankNumber;
  #overdraftLimit;
  // TODO: initialize all necessary properties in constructor body
  //       the construction must be filled with parameters!
  constructor(
    bankName,
    bankNumber,
    accountNumber,
    firstName,
    lastName,
    balance,
    overdraftLimit
  ) {
    this.#accountNumber = accountNumber;
    this.#bankNumber = bankNumber;
    this.#bankName = bankName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.balance = +balance;
    this.#overdraftLimit = +overdraftLimit;
  }

  get accountNumber() {
    return this.#accountNumber;
  }

  get bankName() {
    return this.#bankName;
  }

  get bankNumber() {
    return this.#bankNumber;
  }

  get overdraftLimit() {
    return this.#overdraftLimit;
  }

  getAccountInfo() {
    return `<div><strong>Bankleitzahl:</strong> ${this.accountNumber} </div> <div><strong>Bankname:</strong> ${this.bankName}</div> <div><strong>Kontonummer:</strong> ${this.bankNumber}</div> <div><strong>Vorname Kunde:</strong> ${this.firstName}</div> <div><strong>Nachname Kunde:</strong> ${this.lastName}</div> <div><strong>Kontostand:</strong> ${this.balance} €</div><div><strong>Überziehungslimit:</strong> ${this.overdraftLimit} €</div>`;
  }
  //TODO: implement
  deposit(amount) {
    setTimeout(() => {
      if (amount > 5000) {
        errorMessage(
          'Der Betrag darf nicht größer als 5000€ sein! Es werden nur 5000€ überwiesen'
        );
        amount = 5000;
      }
      if (amount > 0) {
        this.balance += amount;
        successMessage(
          `${amount}€ wurden den Konto ${this.bankNumber} gutgeschrieben. Der neue Kontostand beträgt ${this.balance}€`
        );
      } else {
        errorMessage('Amount must be greater than 0');
      }
    }, 1000);
  }

  //TODO: implement
  withdraw(amount) {
    setTimeout(() => {
      if (amount > 400) {
        errorMessage('Es können maximal 400€ abgehoben werden.');
        return;
      }

      if (amount % 10 !== 0) {
        errorMessage('Es können nur Scheine abgehoben werden.');
        return;
      }

      if (amount > 0 && this.balance - amount >= -this.overdraftLimit) {
        this.balance -= amount;
        successMessage(
          `${amount}€ wurden vom Konto ${this.bankNumber} abgehoben. Der neue Kontostand beträgt ${this.balance}€`
        );
      } else {
        errorMessage('Amount must be greater than 0');
      }
    }, 1000);
  }

  getBalanceStatus() {
    if (this.balance <= 0) {
      return 'Oh je, pleite!';
    } else if (this.balance <= 100) {
      return 'Sehr wenig Geld';
    } else if (this.balance <= 500) {
      return 'Wenig Geld';
    } else if (this.balance <= 2000) {
      return 'Kontostand ok';
    } else if (this.balance <= 3000) {
      return 'Kontostand gut';
    } else {
      return 'Kontostand sehr gut';
    }
  }
}

// Main Program

const bankAccountsData = new Map();

const addBankAccount = (bankAccount) => {
  if (
    [...bankAccountsData.values()].some(
      (account) => account.bankNumber === bankAccount.bankNumber
    )
  ) {
    errorMessage(
      'Ein Bank Account mit dieser Kontonummer existiert bereits! Bitte wählen Sie eine andere Kontonummer.'
    );
    return;
  }

  bankAccountsData.set(bankAccount.bankNumber, bankAccount);
};

// TODO: implement eventhandling:
//       create a new BankAccount Object and add it to the array
document
  .getElementById('customerForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const dataArray = [];
    for (const [_, value] of data.entries()) {
      dataArray.push(value);
    }

    const bankAccount = new BankAccount(...dataArray);
    addBankAccount(bankAccount);
    event.target.reset();
  });

document.getElementById('showAllCustomers').addEventListener('click', () => {
  outputInfos.innerHTML = '';

  [...bankAccountsData.values()].forEach((bankAccount) => {
    outputInfos.innerHTML += `<div><p>${bankAccount.getAccountInfo()}</p><div>`;
  });
});

document
  .getElementById('increaseDepositForm')
  .addEventListener('submit', (event) => {
    event.preventDefault();
    const increaseAmount = +event.target.increaseDeposit.value;
    increaseAllBalances(increaseAmount);
  });

document
  .getElementById('deleteBankNameAccountsForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    const bankName = event.target.deleteBankNameAccountsInput.value;
    removeBankAccountsByBankName(bankName);
  });

document
  .getElementById('sortBankAccounts')
  .addEventListener('click', function () {
    outputInfos.innerHTML = '';
    sortBankAccounts().forEach((bankAccount) => {
      outputInfos.innerHTML += `<div><p>${bankAccount.getAccountInfo()}</p><div>`;
    });
  });

document
  .getElementById('searchAccountForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    const bankNumber = event.target.inAccountToSearch.value;
    const bankAccount = [...bankAccountsData.values()].find(
      (bankAccount) => bankAccount.bankNumber === bankNumber
    );
    if (bankAccount) {
      outputInfos.innerHTML = `<div><p>${bankAccount.getAccountInfo()}</p><div>`;
    } else {
      errorMessage('Es wurde kein Konto mit dieser Kontonummer gefunden!');
    }
  });

// TODO: implement further event handling

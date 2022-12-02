import { ethers } from './ethers-5.1.esm.min.js';
import { contractAddress, abi } from './constants.js';

console.log(ethers)

const connect = document.getElementById('connect');
const fund = document.querySelector('.request');
const sectOne = document.querySelector('.first-section');
const sectTwo = document.querySelector('.second-section');
const sectThree = document.querySelector('.transaction-history-sec');
const addAddy = document.querySelector('.add-addy');
const address = document.getElementById('address-to');
const addedAddy = document.querySelector('.added-addy');
const send = document.getElementById('send-to-multi');
const amountToSend = document.getElementById('amount-to-send');
const sendingTotal = document.querySelector('.hm-ethers');
const confirm = document.getElementById('confirm-transact'); 
const popUp = document.querySelector('.popup-message');
const description = document.getElementById('desc-to-send');
const closeModal = document.querySelector('.close-modal');
const closeConfirm = document.querySelector('.close-modal-fund');
const confirmTransact = document.getElementById('confirm-fund');
const transactTab = document.querySelector('.transactions');
const homeBtn = document.getElementById('go-home');
const contractBal = document.querySelector('.contract-Balance');
const transUl = document.querySelector('.addedTrans');
const spinner = document.querySelector('.spinner');


//NUMBER OF ADDRESSES IN THE DAPP
let addressCount = 0;

let transactCount = 0;

//WHERE ALL THE ACCOUNTS ARE STORED
let accountsArr = [];

//FUNCTION TO CONNECT WALLET TO METAMASK
connect.addEventListener('click', async ()=> {
    if (typeof window.ethereum !== undefined) {
        try {
            const account = await window.ethereum.request({method: "eth_requestAccounts"});
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const balance = await provider.getBalance(contractAddress);

            let accounts = account[0];

            if (accounts.length > 0) {
                sectOne.classList.add('hide-first-section')
                sectTwo.classList.add('show-second-section')
                sectThree.style.display = 'none';

                document.querySelector('.card-address').textContent = `${accounts.substring(0,5)}...${accounts.substring(38,42)}`;
                

                getBalance(); 

                contractBal.textContent = balance / Math.pow(10,18);

            } else {
                sectOne.classList.remove('hide-first-section')
                sectTwo.classList.remove('show-second-section')
                sectThree.style.display = 'none';
            }

        } catch(error) {
            console.log(error.message)
        } 
    } else {
        alert(`install metamask`)
    }
})



/*
CHECKS IF METAMASK IS INSTALLED AND AN ACCOUNT IS PRESENT.....SO THAT THE USER STAYS LOGGED-IN 
EVEN WHEN THE BROWSER IS REFRESHED
*/
const isConnected = async () => {
    if (typeof window.ethereum !== undefined) {
        try {
            const account = await window.ethereum.request({method: "eth_accounts"});
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const balance = await provider.getBalance(contractAddress);

            let accounts = account[0];

            ethereum.on('accountsChanged', (accounts) => {
                accounts = account[0];

                window.location.reload();
            });


            if (accounts.length > 0) {
                sectOne.classList.add('hide-first-section')
                sectTwo.classList.add('show-second-section')
                sectThree.style.display = 'none';

                getBalance(); 

                document.querySelector('.card-address').textContent = `${accounts.substring(0,5)}...${accounts.substring(38,42)}`;

                contractBal.textContent = balance / Math.pow(10,18);

            } else {
                sectOne.classList.remove('hide-first-section')
                sectTwo.classList.remove('show-second-section')
                sectThree.style.display = 'none';
            }
        } catch(error) {
            console.log(error.message)
        } 
    } else {
        alert(`install metamask`)
    }
}

isConnected();

//FUNCTION TO ADD ADDRESSES 
addAddy.addEventListener('click', (e)=> {
    e.preventDefault();

    if (address.value == '') {
        alert('PLEASE FILL IN AN ADDRESS');
    } else {
        addressCount++;

        const addyDiv = document.createElement('div');
        addyDiv.classList.add('addedDiv');
    
        // Create a list of added account
        const list = document.createElement('li');
        list.classList.add('addressList');
        list.textContent = address.value;
        addyDiv.appendChild(list);
        address.value = '';
    
        // Remove account button
        const btn = document.createElement('button');
        btn.classList.add('remove-addy-btn');
        btn.textContent = '-';
        addyDiv.appendChild(btn);
    
        // Append Div to the UL
        addedAddy.appendChild(addyDiv);
    
        //Push the list items to the AccountsArr array 
        accountsArr.push(list.textContent);

        // Add and EventListener to the remove button
        btn.addEventListener('click', removeAddress);
    }
})


// Function to remove an address from List of Addresses
function removeAddress(e) {
    e.preventDefault();
    addressCount--;
    const item = e.target.parentElement
    item.remove();

}


// THE SEND FUNCTIONALITY
send.addEventListener('click', (e)=> {
    e.preventDefault();

    let addyVal = address.value;
    let amountVal = amountToSend.value;

    if (addyVal == '' && amountVal == '') {
        alert ('PLEASE FILL IN THE REMAINING INFORMATION');
    } else {
        document.querySelector(".overlay").style.display = "block";
        document.querySelector(".popup-confirm").style.display = "block";
        popUp.textContent = `You are about to send ${amountVal} Ethers to ${addressCount} address`
    }

}) 


// CONFIRM THE TRANSACTION
 confirm.addEventListener('click', async (e)=> {
    e.preventDefault();

    let amountVal = amountToSend.value;
    let descriptionVal = description.value;

    confirm.innerHTML = 'sending......'
 
    if (typeof window.ethereum !== undefined) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress,abi,signer);

        const parsedAmount = ethers.utils.parseEther(amountVal);

     try {          
        const transactHash = await contract.multiSendFixedEth(accountsArr,parsedAmount,descriptionVal);

        await transactHash.wait();

        const balance = await provider.getBalance(contractAddress);

        contractBal.textContent = balance / Math.pow(10,18);
        transactCount++;

     } catch(error) {
        console.log(error.message);

     } finally {
        window.location.reload();
        confirm.innerHTML = 'Succesful'
     }

    } else {
    alert(`install metamask`)
}

    document.querySelector(".overlay").style.display = "none";
    document.querySelector(".popup-confirm").style.display = "none";
})


// CLOSE MODAL TO GO BACK TO TRANSACTION
closeModal.addEventListener('click', ()=> {
    document.querySelector(".overlay").style.display = "none";
    document.querySelector(".popup-confirm").style.display = "none";
})


// CONFIRM FUNDING ACCOUNT TRANSACTION FUNCTIONALITY
confirmTransact.addEventListener('click', async ()=> {
    const ethAmount = document.getElementById('amount').value;

    if (typeof window.ethereum !== undefined) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress,abi,signer);

        confirmTransact.textContent = 'Funding.....'

        try {
            const transactRes = await contract.allowEther({
                value: ethers.utils.parseEther(ethAmount)
            })

            const balance = await provider.getBalance(contractAddress);

            contractBal.textContent = balance / Math.pow(10,18);

            await transactRes.wait();

        } catch(error) {
            console.log(error.message)

        } finally {
            confirmTransact.textContent = 'Funded'
            closePop();
            window.location.reload();
        }
    } else {
        alert(`install metamask`)
    }
})


// FUND WALLET FUNCTIONALITY
fund.addEventListener('click', ()=> { openPop(); } )


// CLOSE FUND WALLET POPUP 
closeConfirm.addEventListener('click', ()=> {closePop();})

// FUNTION TO CLOSE MODAL/POPUP MESSAGE
function closePop() {
    document.querySelector(".overlay").style.display = "none";
    document.querySelector(".popup-complete").style.display = "none";
}

// FUNCTION TO SHOW MODAL / POPUP MESSAGE
function openPop() {
    document.querySelector(".overlay").style.display = "block";
    document.querySelector(".popup-complete").style.display = "block";
}


// FUNCTIONALITY TO GO TO THE TRANSACTIONS HISTORY TAB
transactTab.addEventListener('click', ()=> {
    sectTwo.classList.remove('show-second-section');
    sectThree.style.display = 'block';
})

// FUNCTION TO GO BACK TO THE MAIN TRANSACTION SCREEN
homeBtn.addEventListener('click', ()=> {
    sectTwo.classList.add('show-second-section');
    sectThree.style.display = 'none';

    //window.location.reload();
})


//Function to get Balance of address/Contract
async function getBalance() {
    if (typeof window.ethereum !== undefined) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const balance = await provider.getBalance(contractAddress);
            
            contractBal.textContent = balance / Math.pow(10,18);

        } catch(error) {
            console.log(error.message)
        } 
    } else {
        alert(`install metamask`)
    }
}

getBalance(); 


// Trasaction tab event Listener
getAllTransaction();

//Function get all transaction
async function getAllTransaction() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress,abi,signer);

    try {
        const getTrans = await contract.getAllTransaction();

        //Create a list for each transaction address
        const transList = document.createElement('li');
        transList.classList.add('ListStyle');

        for (let index = 0; index < getTrans.length; index++) {
            const element = getTrans[index];

            let addressFrom  = element[0];
            let amountSent = element[2];
            let descSent = element[3];
            let date = element[4];


            const afSpan = document.createElement('span');
            const noaSpan = document.createElement('span');
            const asSpan = document.createElement('span');
            const dsSpan = document.createElement('span');
            const dtSpan = document.createElement('span');

            afSpan.textContent = addressFrom;
            asSpan.textContent = amountSent / Math.pow(10,18);
            dsSpan.textContent = descSent;
            dtSpan.textContent = new Date(date * 1000).toLocaleString();

            const div = document.createElement('li');
            div.classList.add('divList');

            div.appendChild(afSpan);
            div.appendChild(noaSpan);
            div.appendChild(asSpan);
            div.appendChild(dsSpan);
            div.appendChild(dtSpan);

            transUl.appendChild(div);
        }
    } catch(error){
        console.log(error.message);
    }
}
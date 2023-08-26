import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, onSnapshot,
  addDoc, deleteDoc, doc, where, query,
  orderBy, serverTimestamp, getDoc,
   updateDoc
} from 'firebase/firestore'

import { 
  getAuth, createUserWithEmailAndPassword, signOut,
  signInWithEmailAndPassword, onAuthStateChanged,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCRmsmqnAokcTl3q1Eeyo1Bl-KY1Zr1Ci8",
  authDomain: "test1-6ba8d.firebaseapp.com",
  projectId: "test1-6ba8d",
  storageBucket: "test1-6ba8d.appspot.com",
  messagingSenderId: "291180707984",
  appId: "1:291180707984:web:9b26d56459607becc45815"
}

// init firebase
initializeApp(firebaseConfig)

// init services
const db = getFirestore()
const auth = getAuth()

// collection ref
const colRef = collection(db, 'books')

// queries
//const q = query(colRef,/*where("author", "==", "patrick rothfuss"),*/ orderBy('createdAt'))

// realtime collection data
onSnapshot(colRef, (snapshot) => {
  let books = []
  snapshot.docs.forEach(doc => {
    books.push({ ...doc.data(), id: doc.id })
  })
  console.log(books) 
})

// adding docs
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp()
  })
  .then(() => {
    addBookForm.reset()
  })
})

// deleting docs
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'books', deleteBookForm.id.value)

  deleteDoc(docRef)
    .then(() => {
      deleteBookForm.reset()
    })
})

// fetching a single document (& realtime)

const docRef = doc(db, 'books', '8u3ciWG6225VdvVj5dV6')

   getDoc(docRef)
  .then(doc => {
     //console.log(doc.data(), doc.id)
   })

   onSnapshot(docRef, (doc) => {
    //console.log(doc.data(), doc.id)
   })

  // updating a document
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
  e.preventDefault()

  let docRef = doc(db, 'books', updateForm.id.value)

  updateDoc(docRef, {
    
    title: 'fuck you',
    age: '52',
    house:'manchester',
    Author:'tennese',
  })
  .then(() => {
    updateForm.reset()
  })
})

// signing users up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      //console.log('user created:', cred.user)
      signupForm.reset()
    })
    .catch((err) => {
      console.log(err.message)
    })
})
//console.log(signupForm.email.value)

// logging in and out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      //console.log('user signed out')
    })
    .catch(err => {
      console.log(err.message)
    })
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email, password)
    .then(cred => {
      //console.log('user logged in:', cred.user)
      loginForm.reset()
    })
    .catch(err => {
      console.log(err.message)
    })
})

//subscribing to auth changes
onAuthStateChanged(auth,(user)=> {
  console.log('user status changed:', user)


  if (user) {
    // User is signed in
    const uid = user.uid;
    const email = user.email;
    console.log('uid:', uid);
    //console.log('Email:', email);

    function getStringBeforeAt(email) {
      const atIndex = email.indexOf('@');
      if (atIndex !== -1) {
          return email.substring(0, atIndex);
      } else {
          return null; // Return null if "@" is not found in the email
      }
  }
  
  // Example usage
  
  const username = getStringBeforeAt(email);
  console.log(username); // This will output: "before email"
  

    // You can use the user object to access other properties as needed
  } else {
    // User is signed out
    console.log('User is signed out');
  }
})









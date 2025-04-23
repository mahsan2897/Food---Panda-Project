import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, deleteField } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBxRyE-OGXaCehXvYYdZoavu66mqUcFIBA",
  authDomain: "food-panda-project-6d55a.firebaseapp.com",
  projectId: "food-panda-project-6d55a",
  storageBucket: "food-panda-project-6d55a.firebasestorage.app",
  messagingSenderId: "930197825643",
  appId: "1:930197825643:web:f01144f30234731a34292e",
  measurementId: "G-ZKTB8DJ9NV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    if (location.pathname.endsWith('/userSignup.html') || location.pathname.endsWith('/userLogin.html')) {
        location.href = 'userDashboard.html'
      
    }
    if (location.pathname.endsWith('/adminLogin.html') || location.pathname.endsWith('/adminSignup.html')) {
        location.href = 'adminDashboard.html'
      
    }
    
  }  else {
    if(location.pathname.endsWith('/adminDashboard.html')){
      location.href = './adminLogin.html';
    }
    if(location.pathname.endsWith('/userDashboard')){
      location.href = './userLogin.html';
    }
  }
});

let getsignUpBtn = document.getElementById('s-Btn')
if (getsignUpBtn) {
  getsignUpBtn.addEventListener('click', () => {
    let email = document.getElementById('semail')
    let password = document.getElementById('spassword')
    let UserName = document.getElementById('sname')
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        const user = userCredential.user;
        Swal.fire({
          title: "Sign up Successfully!",
          text: `congrats ${user.email}`,
          icon: "success"
        })
        console.log(user.email)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
      });

  })
}

let getLoginBtn = document.getElementById('l-Btn')
if (getLoginBtn) {
  getLoginBtn.addEventListener('click', () => {
    let email = document.getElementById('lemail')
    let password = document.getElementById('lpassword')
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        const user = userCredential.user;
        Swal.fire({
          title: "Login Successfully!",
          text: `congrats ${user.email}`,
          icon: "success"
        })
        console.log(user.email)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid Credential",
        });
        console.log(errorCode, errorMessage)
      });
  })
}

let getadminLogoutBtn = document.getElementById('logout')
getadminLogoutBtn.addEventListener('click', () => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to log out?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "You LogOut",
            text: "Your file has been deleted.",
            icon: "success"
          }).then(() => {
            window.location.href = './index.html'
          })
        }
      });
    }).catch((error) => {
      console.log(error)
    });
})

let getuserLogoutBtn = document.getElementById('logout')
getuserLogoutBtn.addEventListener('click', () => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to log out?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Logging out?",
            text: "Thanks for stopping by. See you again soon!.",
            icon: "success"
          }).then(() => {
            window.location.href = './index.html'
          })
        }
      });
    }).catch((error) => {
      console.log(error)
    });
})

const getName = document.getElementById("name");
const getPrice = document.getElementById("price");
const getdiscription = document.getElementById("dis");
const getImgUrl = document.getElementById("img-url");
const getCards = document.getElementById("cards");
const getsaveDataBtn = document.getElementById("savedata");

if (getsaveDataBtn) {
  getsaveDataBtn.addEventListener("click", async () => {
    getCards.innerHTML = "";
    try {
      const docRef = await addDoc(collection(db, "dishes"), {
        name: getName.value,
        price: getPrice.value,
        discription: getdiscription.value,
        image: getImgUrl.value
      });
      Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Saved!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
      addData();
    } catch (e) {
      console.log("Error adding document:", e);
    }
  });
}

window.addData = async function () {
  if (!getCards) return;
  getCards.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "dishes"));
  querySnapshot.forEach((docSnap) => {
    const dish = docSnap.data();
    getCards.innerHTML += `
      <div class="card m-2 pt-2" style="width: 18rem;">
        <img src="${dish.image}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title name">${dish.name}</h5>
          <p class="card-text">${dish.discription}</p>
          <h5 class="card-title">Price: ${dish.price}</h5>
          <div class="continer text-center">
            <a href="#" class="btn btn-primary" onclick="openEditModal('${docSnap.id}', '${dish.name}', '${dish.price}', '${dish.discription}', '${dish.image}')">Edit</a>
            <a href="#" class="btn btn-danger" onclick="delItem('${docSnap.id}')">Delete</a>
          </div>
        </div>
      </div>`;
  });
};

// Edit Modal
window.openEditModal = function (id, name, price, discription, image) {
  document.getElementById("editProductId").value = id;
  document.getElementById("editProductName").value = name;
  document.getElementById("editProductPrice").value = price;
  document.getElementById("editProductDesc").value = discription;
  document.getElementById("editProductImage").value = image;

  const modal = new bootstrap.Modal(document.getElementById("editProductModal"));
  modal.show();
};

window.saveProductChanges = async function () {
  const id = document.getElementById("editProductId").value;
  const updatedData = {
    name: document.getElementById("editProductName").value,
    price: document.getElementById("editProductPrice").value,
    discription: document.getElementById("editProductDesc").value,
    image: document.getElementById("editProductImage").value
  };

  const dishRef = doc(db, "dishes", id);
  await updateDoc(dishRef, updatedData);
  Swal.fire("Updated!", "Dish updated successfully.", "success");
  addData();
};

// Delete
window.delItem = async function (id) {
  await deleteDoc(doc(db, "dishes", id));
  Swal.fire("Deleted!", "Dish removed.", "success");
  addData();
};

// Load admin data if on admin page
if (getCards) {
  addData();
}

const dishesContainer = document.getElementById("dishesContainer");

// Load dishes
async function loadDishes() {
  const querySnapshot = await getDocs(collection(db, "dishes"));
  dishesContainer.innerHTML = ''; // clear before re-render
  querySnapshot.forEach((doc) => {
    const dish = doc.data();
    const dishId = doc.id;

    dishesContainer.innerHTML += `
      <div class="dish-card">
        <img src="${dish.image}" alt="${dish.name}" class="dish-image">
        <h3 class="dname">${dish.name}</h3>
        <h4 class="dprice">Price: ${dish.price}</h4>
        <button class="dbtn" onclick='addToCart("${dishId}", "${dish.name}", "${dish.price}", "${dish.image}")'>Order Now</button>
      </div>
    `;
    
  });
}

window.addToCart = function(dishId, name, price, description, image) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const newItem = { dishId, name, price, description, image };

  const exists = cart.find(item => item.dishId === dishId);
  if (exists) {
    alert("Already in cart!");
    return;
  }

  cart.push(newItem);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
};

loadDishes();




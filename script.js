const formData = document.querySelector(".input-data");
const title = document.getElementById("title");
const price = document.getElementById("price");
const taxes = document.getElementById("taxes");
const ads = document.getElementById("ads");
const discount = document.getElementById("discount");
const total = document.querySelector(".total");
const count = document.getElementById("count");
const category = document.getElementById("category");
const createDataBtn = document.getElementById("add-data");
const searchInput = document.getElementById("search-input");
const deleteAllBtn = document.getElementById("delete-all");
const productsList = document.querySelector(".Products-list");
let editingProductData = null;
let arrayOfProducts = JSON.parse(localStorage.getItem("products")) || [];


const saveDataOfProducts = () => {
  localStorage.setItem("products", JSON.stringify(arrayOfProducts));
};

const checkData = (titleValue,priceValue,taxesValue,adsValue,countValue,categoryValue) => {
  if (!titleValue) return "please enter the title";
  if (!priceValue) return "please enter the price";
  if (!taxesValue) return "please enter the taxes";
  if (!adsValue) return "please enter the ads";
  if (!countValue) return "please enter the count";
  if (!categoryValue) return "please enter the category";
  return "";
};

const addProduct = (titleValue,priceValue,taxesValue,adsValue,discountValue,countValue,categoryValue) => {
  const countNumber = Number(countValue) || 1;
  for(let i = 0; i < countNumber; i++) {
  const newProduct = {
    id: null,
    title: titleValue,
    price: priceValue,
    taxes: taxesValue,
    ads: adsValue,
    discount: discountValue,
    total: calculateTotal(priceValue, taxesValue, adsValue, discountValue),
    count: 1,
    category: categoryValue
    };
    arrayOfProducts.push(newProduct);
  }
  renderIDs();
  saveDataOfProducts();
  renderProducts();
  updateDeleteAllBtn();
};

const renderIDs = () => {
  arrayOfProducts.forEach((product,index) => {
    product.id = index + 1;
  });
}

const calculateTotal = (priceValue, taxesValue, adsValue, discountValue) => {
  const totalValue = (Number(priceValue) + Number(taxesValue) + Number(adsValue)) - Number(discountValue || 0);
  if(totalValue <= 0) {
    total.textContent = `Total: 0`;
    total.style.backgroundColor = "#ef4444";
  } else {
    total.textContent = `Total: ${totalValue}💲`;
    total.style.backgroundColor = "#22c55e";
  }
  return totalValue;
};

const checkTotal = (value) => {
  return value <= 0 ? "0" : value;
}

const createProductElement = (product) => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${product.id}</td>
    <td>${product.title}</td>
    <td>${product.price}</td>
    <td>${product.taxes}</td>
    <td>${product.ads}</td>
    <td>${product.discount}</td>
    <th>${checkTotal(product.total)}</th>
    <td>${product.category}</td>
    <td><button type="button" class="update">Update</button></td>
    <td><button type="button" class="delete">Delete</button></td>
  `;
  const deleteBtn = tr.querySelector(".delete");
  const editBtn = tr.querySelector(".update");
  editBtn.addEventListener("click", () => {
    editingProductData = product.id
    title.value = product.title;
    price.value = product.price;
    taxes.value = product.taxes;
    ads.value = product.ads;
    discount.value = product.discount;
    count.value = product.count;
    category.value = product.category;
    createDataBtn.textContent = "Update";
  });
  deleteBtn.addEventListener("click", () => {
    deleteProduct(product.id);
  });
  return tr;
}

const UpdateProductData = (titleValue,priceValue,taxesValue,adsValue,discountValue,countValue,categoryValue) => {
  arrayOfProducts = arrayOfProducts.map((product) => {
    if(product.id === editingProductData) {
      return {
        id: product.id,
        title: titleValue,
        price: priceValue,
        taxes: taxesValue,
        ads: adsValue,
        discount: discountValue,
        total: calculateTotal(priceValue, taxesValue, adsValue, discountValue),
        count: countValue,
        category: categoryValue
      }
    }
    return product;
  });
  editingProductData = null;
  createDataBtn.textContent = "Create";
  saveDataOfProducts();
  renderIDs();
  renderProducts();
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  count.value = "";
  category.value = "";
}

const deleteProduct = (id) => {
  if(confirm("are you sure to remove this product?")) {
    arrayOfProducts = arrayOfProducts.filter((product) => product.id !== id);
    saveDataOfProducts();
    renderIDs();
    updateDeleteAllBtn();
    renderProducts();
  }
}

const updateDeleteAllBtn  = () => {
  deleteAllBtn.textContent = `Delete All (${arrayOfProducts.length})`;
}

const deleteAllProducts = () => {
  if(confirm("are you sure to remove all products")) {
    arrayOfProducts = [];
    localStorage.removeItem("products");
    renderProducts();
    updateDeleteAllBtn();
  }
}

deleteAllBtn.addEventListener("click", deleteAllProducts);

const renderProducts = (filteredProducts = arrayOfProducts) => {
  productsList.innerHTML = "";
  if (filteredProducts.length > 0) {
    filteredProducts.forEach((product) => {
      productsList.appendChild(createProductElement(product));
    });
  } else {
    productsList.innerHTML = `<tr><td colspan="10">There are no products.</td></tr>`;
  }
};

renderProducts();
updateDeleteAllBtn();

const searchProducts = (products, query) => {
  return products.filter((product) => {
    return (
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
  });
};

searchInput.addEventListener("input", (event) => {
  const searchQuery = event.target.value.trim();
  let filteredProducts = arrayOfProducts;
  if (searchQuery) {
    filteredProducts = searchProducts(arrayOfProducts, searchQuery);
  }
  renderProducts(filteredProducts);
});

formData.addEventListener("submit", (event) => {
  event.preventDefault();
  const titleValue = title.value.trim();
  const priceValue = price.value;
  const taxesValue = taxes.value;
  const adsValue = ads.value;
  const discountValue = discount.value;
  const countValue = count.value;
  const categoryValue = category.value.trim();
  const alertMsg = checkData(titleValue,priceValue,taxesValue,adsValue,countValue,categoryValue);
  if (alertMsg) {
    alert(alertMsg);
    return "";
  }
  if(editingProductData) {
    UpdateProductData(titleValue,priceValue,taxesValue,adsValue,discountValue,countValue,categoryValue);
  } else {
    addProduct(titleValue,priceValue,taxesValue,adsValue,discountValue,countValue,categoryValue);
    calculateTotal(priceValue, taxesValue, adsValue, discountValue);
  }
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  count.value = "";
  category.value = "";
});
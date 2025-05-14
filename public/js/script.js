//for form validation from bootstrap
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

//   //this is filter category of the is room or is hotel or is hotel
  
//   function filterItems() {
//     const categoryId = document.getElementById("category").value;
    
//     // Make an API call to your server to fetch filtered items
//     fetch(`/filter-items?category_id=${categoryId}`)
//         .then(response => response.json())
//         .then(data => {
//             // Clear the existing items
//             const itemList = document.getElementById("itemList");
//             itemList.innerHTML = '';
            
//             // Display the filtered items
//             data.items.forEach(item => {
//                 const listItem = document.createElement("li");
//                 listItem.textContent = item.name + " - " + item.description;
//                 itemList.appendChild(listItem);
//             });
//         })
//         .catch(error => console.error('Error:', error));
// }

// import React, { useState, useEffect } from 'react';

// // Dummy categories for the select dropdown (can be fetched from API or predefined)
// const categories = [
//     { id: 1, name: 'Rooms' },
//     { id: 2, name: 'Hotels' },
//     { id: 3, name: 'Farms' },
//     { id: 4, name: 'Mountains' },
//     // Add more categories as needed
// ];

// const CategoryFilter = () => {
//     const [selectedCategory, setSelectedCategory] = useState(null);  // selected category id
//     const [items, setItems] = useState([]);  // list of items to be displayed
//     const [loading, setLoading] = useState(false);  // loading state to show a spinner if needed

//     // Fetch items based on selected category
//     const fetchItemsByCategory = async (categoryId) => {
//         setLoading(true);

//         try {
//             const response = await fetch(`/api/items?category_id=${categoryId}`);
//             const data = await response.json();
//             setItems(data.items);
//         } catch (error) {
//             console.error('Error fetching items:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // When the category is changed, fetch new data
//     const handleCategoryChange = (event) => {
//         const categoryId = parseInt(event.target.value);
//         setSelectedCategory(categoryId);
//         fetchItemsByCategory(categoryId);
//     };

//     useEffect(() => {
//         if (selectedCategory !== null) {
//             fetchItemsByCategory(selectedCategory);
//         }
//     }, [selectedCategory]);

//     return (
//         <div>
//             {/* Category Dropdown */}
//             <label htmlFor="category">Select a Category:</label>
//             <select id="category" onChange={handleCategoryChange}>
//                 <option value="">Select Category</option>
//                 {categories.map((category) => (
//                     <option key={category.id} value={category.id}>
//                         {category.name}
//                     </option>
//                 ))}
//             </select>

//             {/* Loading indicator */}
//             {loading && <p>Loading...</p>}

//             {/* Displaying filtered items */}
//             <div>
//                 <h3>Items in Category: {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'None'}</h3>
//                 <ul>
//                     {items.length === 0 && !loading && <p>No items available.</p>}
//                     {items.map((item) => (
//                         <li key={item.id}>
//                             {item.name} - {item.description}
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// };

// export default CategoryFilter;

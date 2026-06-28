// src/components/Navbar.jsx
// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../theme";
import "../styles/Navbar.css";

import logoLight from "../assets/images/logo-light.svg";
import logoDark from "../assets/images/logo-dark.svg";


import {
FaFire,
FaStar,
FaClock,
FaFistRaised,
FaHiking,
FaTv,
FaUserSecret,
FaHeart,
FaExclamationTriangle,
FaFlask,
} from "react-icons/fa";


import {
GiMagnifyingGlass,
GiScrollUnfurled,
GiDramaMasks,
} from "react-icons/gi";


import {
MdAnimation,
MdOutlineFamilyRestroom,
MdOutlineEmojiEmotions,
} from "react-icons/md";


import { BiGhost } from "react-icons/bi";



const categories = [
{
id:"popular",
label:"Popular",
icon:<FaFire/>
},

{
id:"top_rated",
label:"Top Rated",
icon:<FaStar/>
},

{
id:"upcoming",
label:"Upcoming",
icon:<FaClock/>
}

];



const genres=[

{
id:"16",
label:"Animation",
icon:<MdAnimation/>
},

{
id:"9648",
label:"Mystery",
icon:<GiMagnifyingGlass/>
},

{
id:"878",
label:"Sci-Fi",
icon:<FaFlask/>
},

{
id:"36",
label:"History",
icon:<GiScrollUnfurled/>
},

{
id:"28",
label:"Action",
icon:<FaFistRaised/>
},

{
id:"12",
label:"Adventure",
icon:<FaHiking/>
},


{
id:"10759",
label:"Series",
icon:<FaTv/>
},

{
id:"27",
label:"Horror",
icon:<BiGhost/>
},


{
id:"80",
label:"Crime",
icon:<FaUserSecret/>
},


{
id:"35",
label:"Comedy",
icon:<MdOutlineEmojiEmotions/>
},


{
id:"18",
label:"Drama",
icon:<GiDramaMasks/>
},


{
id:"10751",
label:"Family",
icon:<MdOutlineFamilyRestroom/>
},


{
id:"10749",
label:"Romance",
icon:<FaHeart/>
},


{
id:"53",
label:"Thriller",
icon:<FaExclamationTriangle/>
}

];





const Navbar = ({
isOpen,
onClose,
onSelectCategory,
selectedCategory
})=>{


const {theme}=useTheme();

const logo =
theme==="dark"
? logoDark
: logoLight;



const renderItem=(item,type)=>{


return (

<li key={item.id}>

<button

className={`
nav-item
${
selectedCategory?.type===type &&
selectedCategory.id===item.id
?"active"
:""
}

`}


onClick={()=>{

onSelectCategory({
type,
id:item.id,
label:item.label
});

}}

>


<span className="nav-icon">

{item.icon}

</span>


<span className="nav-label">

{item.label}

</span>


</button>


</li>

)


}




return (

<>

{
isOpen &&
<div
className="navbar-overlay"
onClick={onClose}
/>
}



<aside
className={`navbar ${isOpen?"open":""}`}
>



<div className="navbar-top">


<Link
to="/"
className="navbar-brand"
>


<img

src={logo}

alt="PurpleFlix"

className="navbar-logo"

/>


</Link>


</div>





<div className="navbar-scroll">



<div className="nav-group">


<h3>
Discover
</h3>


<ul>

{
categories.map(
item=>renderItem(item,"category")
)
}

</ul>


</div>





<div className="nav-divider"/>





<div className="nav-group">


<h3>
Genres
</h3>



<ul>

{
genres.map(
item=>renderItem(item,"genre")
)
}


</ul>


</div>




</div>





<div className="navbar-footer">

<span>
PurpleFlix
</span>

<small>
Enjoy movies
</small>


</div>




</aside>


</>


)


}


export default Navbar;
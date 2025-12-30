import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  CircularProgress,
  InputBase,
  MenuItem,
  Select,
  IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import SearchIcon from "@mui/icons-material/Search";
import InfiniteScroll from "react-infinite-scroll-component";
import { getCachedEvents, setCachedEvents, clearCachedEvents } from '../../services/data/events/eventsCache'
import {
  CustomCarousel,
  EventsByCategory,
} from "../../components";
import ProductSkeleton from "../../components/ProductSkeleton";

import { getAllCategories } from "../../services/data/categories";
import { getAllCountries } from "../../services/data/countries";
import { getCountryCategoryEvents } from "../../services/data/events";
import { getAllPages } from "../../services/data/pages";
import { getAllSlides } from "../../services/data/slides";
import { getUserProfile } from "../../services/profile";
import { getCategories } from "../../store/slice/categories";
import { getCountries } from "../../store/slice/countries";
import { getEvents } from "../../store/slice/events";
import { getSlides } from "../../store/slice/slides";

import { selectCategories } from "../../store/slice/categories";
import { selectEventsData } from "../../store/slice/events";
import { selectUser, updateUserData } from "../../store/slice/user";
import { Style } from "./style";
import { changeLanguage } from "../../components"; // make sure path is correct

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scrollAbleDivRef = useRef(null);

  const user = useSelector(selectUser);
  const categories = useSelector(selectCategories);
  const { language, countryId, category } = user;

  // --- STATE ---
  const [eventsData, setEventsData] = useState([]);
  const [slides, setSlides] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const skeletonArray = new Array(8);

  // --- 🔑 NEW: INIT USER PROFILE ---
  useEffect(() => {
    async function initUser() {
      // language
      let lang = localStorage.getItem("language") || "en";
      changeLanguage(lang);

      // token/profile
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await getUserProfile(token); // wrapper for /api/profile
          if (res?.data) {
            dispatch(updateUserData({ ...res.data, token }));
          } else {
            localStorage.removeItem("token");
          }
        } catch (err) {
          console.error("Profile fetch error", err);
          localStorage.removeItem("token");
        }
      }
    }
    initUser();
  }, [dispatch]);

  // --- FETCH HOME DATA ---
useEffect(() => {
  let isMounted = true;

  async function initHome() {
    setLoading(true);

    const eventsRes = await getCountryCategoryEvents({
        page: nextPage,
        number: 12,
        country: countryId || 1,
        category: category?.id || 0,
        searchKey: "",
      });

    if (!isMounted) return;

    setEventsData(eventsRes.data.data.data);
    setLoading(false);
  }

  initHome();

  return () => {
    isMounted = false;
  };
}, [countryId, category?.id]);

// useEffect(() => {
//   clearCachedEvents();
// }, [countryId, category?.id]);
  const fetchMoreData = async () => {
    try {
      const events = await getCountryCategoryEvents({
        page: nextPage,
        number: 12,
        country: countryId || 1,
        category: category?.id || 0,
        searchKey: "",
      });

      setEventsData((prev) => [...prev, ...events.data.data.data]);
      setHasMore(!!events.data.data.next_page_url);
      setNextPage((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const isArabic = language === "ar";

  const handleSearchSubmit = () => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (categoryId) params.set("category", categoryId);
    navigate(`/search?${params.toString()}`);
  };

  // ... return UI ...


  return (
    <Box sx={Style.main}>
      <CustomCarousel />

     {/* Search Bar */}
<Box
  sx={{
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 186, 131, 0.2)",
    borderRadius: 3,
    p: 0.25,   // tighter padding
    mt: 2,
    mb: 1,
    display: "flex",
    alignItems: "center",
    gap: 0,
    flexDirection: isArabic ? "row-reverse" : "row",
  }}
>
  <InputBase
    placeholder="Discover amazing events..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    sx={{
      flex: "1 1 50%",
      background: "transparent",
      px: 1.5, // reduced side padding
      color: "white !important",
      fontSize: "0.75rem",
      fontWeight: 400,
      borderRadius: isArabic ? "0 10px 10px 0" : "10px 0 0 10px",
      "& .MuiInputBase-input::placeholder": {
        color: "rgba(255,255,255,0.6)",
      },
    }}
  />

  <Select
  value={categoryId}
  onChange={(e) => setCategoryId(e.target.value)}
  displayEmpty
  sx={{
    flex: "1 1 30%",
    minHeight: 36, // even sleeker
    fontSize: "0.9rem",
    color: "white !important",
    p: 0,   // remove padding
    "& .MuiSelect-select": {
      py: 0,
      px: 1,   // keep a little horizontal space
      minHeight: "unset !important", // kills the built-in minHeight
      lineHeight: 1.2,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none", // optional, removes extra outline padding
    },
  }}
>
  <MenuItem value="" sx={{ py: 0.5, fontSize: "0.9rem" }}>
    🏷️ All
  </MenuItem>
  {categories.map((cat) => (
    <MenuItem key={cat.id} value={cat.id} sx={{ py: 0.5, fontSize: "0.9rem" }}>
      {cat.translation[language]?.name}
    </MenuItem>
  ))}
</Select>


  <IconButton onClick={handleSearchSubmit} sx={{ p: 0.5 }}>
    <SearchIcon sx={{ color: "white", fontSize: "1.2rem" }} />
  </IconButton>
</Box>

      {/* Events */}
      {loading ? (
  <ProductSkeleton />
) : eventsData.length === 0 ? (
  <Box
    sx={{
      mt: 4,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      opacity: 0.85,
    }}
  >
    {/* SVG ICON */}
    <Box sx={{ width: 140, mb: 2 }}>
      <img
        src="/assets/no-data.svg"
        alt="No events"
        style={{ width: "100%", height: "auto" }}
      />
    </Box>

    {/* TEXT */}
    <Box
      sx={{
        color: "rgba(255,255,255,0.7)",
        fontSize: "0.9rem",
        textAlign: "center",
      }}
    >
      No events found
    </Box>
  </Box>
) : (
  <EventsByCategory
    eventsData={eventsData}
    skeletonArray={skeletonArray}
    language={language}
  />
)}

    </Box>
  );
};

export default Home;

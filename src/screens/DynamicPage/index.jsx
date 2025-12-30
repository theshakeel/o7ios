import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getSinglePage } from "../../services/data/pages";
import { selectUser } from "../../store/slice/user";
import { COLORS } from "../../theme";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Style from "./style";

const DynamicPage = () => {
  const { page_slug } = useParams();
  const { language } = useSelector(selectUser);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const user = useSelector(selectUser);
  const [data, setData] = useState();
  // const handlePageData = async () => {
  //   try {
  //     console.log("getting single page", page_slug)
  //     const res = await getSinglePage(page_slug);
  //     setData(res.data.data);
      
  //     setLoader(false);
  //   } catch (err) {
  //     setLoader(false);
  //     console.log(err)
  //     // navigate("/");
  //   }
  // };
  useEffect(() => {
  setLoader(true);
  setData(null);
}, [page_slug]);
  useEffect(() => {
  let isMounted = true;

  const handlePageData = async () => {
    try {
      const res = await getSinglePage(page_slug);
      if (!isMounted) return;
      setData(res.data.data);
    } catch (err) {
      if (!isMounted) return;
      console.error(err);
    } finally {
      if (isMounted) setLoader(false);
    }
  };

  handlePageData();

  return () => {
    isMounted = false;
  };
}, [page_slug]);


  if (loader) {
    return (
      <Box
        sx={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={100} color="secondary" />
      </Box>
    );
  }

  return (
    <Box sx={Style.container}>
      <Box sx={Style.firstChild}>
        <Typography sx={Style.hedingContainer}>
          <ArrowBackIcon onClick={() => navigate("/")} />
        </Typography>
        <Box sx={Style.heading}>{data?.translation?.[language]?.title}</Box>
      </Box>

      <Box
        sx={{ color: COLORS.white, wordBreak: "break-all" }}
        dangerouslySetInnerHTML={{
          __html: data?.translation[language]?.content,
        }}
      />
    </Box>
  );
};

export default DynamicPage;

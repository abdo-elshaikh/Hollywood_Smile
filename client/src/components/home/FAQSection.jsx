import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Container } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../services/axiosInstance";


const FAQSection = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await axiosInstance.get('/faqs');
        if (response.status === 200) {
          const data = response.data;
          setFaqData(data.filter(faq => faq.showInHome && faq.available));
        } else {
          console.error('Failed to fetch FAQs');
        }
      } catch (error) {
        console.error('Failed to fetch FAQs', error);
      }
    }
    fetchFAQs();
  }, []);

  // Sort FAQs in ascending order based on the 'order' property
  const sortedFAQs = faqData.sort((a, b) => a.order - b.order).slice(0, 5);

  return (
    <Box component={Container} sx={{ maxWidth: "lg", py: 6 }}>
      <Grid container spacing={2}>
        {/* Left side: Introduction */}
        <Grid item xs={12} md={6} >
          <Typography variant="h2" align={isArabic ? "right" : "left"} sx={{ color: "#184e77", marginBottom: 4 }}>
            {t("FAQSection.title")} <span style={{ color: "#f07167" }}>{t("FAQSection.subtitle")}</span>
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: "#6d6875", marginBottom: 4 }}>
            {t("FAQSection.description")}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href="/faq"
            sx={{
              backgroundColor: "#184e77",
              "&:hover": { backgroundColor: "#f07167" },
              marginBottom: 4,
            }}
          >
            {t("FAQSection.learnMore")}
          </Button>
        </Grid>

        {/* Right side: FAQ section */}
        <Grid item xs={12} md={6}>
          <FAQContent faqData={sortedFAQs} isArabic={isArabic} />
        </Grid>
      </Grid>
    </Box>
  );
};

const FAQContent = ({ faqData = [], isArabic }) => {

  return (
    <>
      {faqData.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Accordion
            sx={{
              backgroundColor: "#fff",
              borderRadius: 1,
              boxShadow: 1,
              marginBottom: 2,
              "&:before": { display: "none" },
              "&.Mui-expanded": {
                backgroundColor: "#f07167",
                color: "#fff",
                "& .MuiAccordionSummary-root": { backgroundColor: "#f07167" },
                "& .MuiTypography-root": { color: "#fff" },
              },
              "&:hover": { boxShadow: 3 },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore sx={{ color: "#184e77" }} />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              sx={{
                backgroundColor: "#edf6f9",
                borderRadius: 1,
                "&.Mui-expanded": { backgroundColor: "#f07167" },
                "&:hover": { backgroundColor: "#ffddd2" },
              }}
            >
              <Typography sx={{ color: "#184e77", fontWeight: 600 }}>{isArabic ? faq.question_ar : faq.question_en}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: "#6d6875" }}>{isArabic ? faq.answer_ar : faq.answer_en}</Typography>
            </AccordionDetails>
          </Accordion>
        </motion.div>
      ))}
    </>
  );
};

export default FAQSection;

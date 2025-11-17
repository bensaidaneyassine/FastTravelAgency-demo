
import React from "react";
import "../styles/detailsModal.css";
import { useTranslation } from "react-i18next";

export default function TravelDetail() {
  const { t } = useTranslation();

  return (
    <>
      <div
        className="modal detailsModal fade p-2"
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("travelProgram")}
              </h5>
            </div>
            <div className="modal-body">
              <h2 className="fw-bold specialText">{t("duration")}</h2>
              <h3 className="fw-bold specialText">{t("priceTravelIncludes")}</h3>
              <ul className="p-2" >
                {t("includesList").split('.').map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <h3 className="fw-bold specialText">{t("priceExcludes")}</h3>
              <ul className="p-2">
                {t("excludesList").split('.').map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <div className="day">
                <h4 className="fw-bold specialText">{t("dayOne")}</h4>
                <p>{t("dayOneDetails")}</p>
              </div>
              <div className="day">
                <h4 className="fw-bold specialText">{t("dayTwo")}</h4>
                <p>{t("dayTwoDetails")}</p>
              </div>
              <div className="day">
                <h4 className="fw-bold specialText">{t("dayThree")}</h4>
                <p>{t("dayThreeDetails")}</p>
              </div>
              <div className="day">
                <h4 className="fw-bold specialText">{t("dayFour")}</h4>
                <p>{t("dayFourDetails")}</p>
              </div>
              <div className="day">
                <h4 className="fw-bold specialText">{t("dayFive")}</h4>
                <p>{t("dayFiveDetails")}</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}
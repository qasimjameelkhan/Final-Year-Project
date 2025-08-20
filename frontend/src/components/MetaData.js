import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

const MetaData = ({ title }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Helmet>
      <title>{`${title} - ArtistryHub`}</title>
    </Helmet>
  );
};

export default MetaData;

import React from 'react';
import styled from 'styled-components';

const Footer = () => {
    return (
      <FooterContainer>
        <FooterContent>
          <FooterLeft>
            <h3>ArtistryHub</h3>
            <p>Your gateway to creativity and inspiration.</p>
          </FooterLeft>
          <FooterMiddle>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#portfolio">Portfolio</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </FooterMiddle>
          <FooterRight>
            <h4>Follow Us</h4>
            <SocialIcons>
              <a href="#" target="_blank" rel="noopener noreferrer">
                {/* Facebook Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24h11.495V14.708h-3.13v-3.6h3.13v-2.653c0-3.1 1.894-4.785 4.66-4.785 1.325 0 2.463.1 2.793.143v3.24h-1.917c-1.504 0-1.797.715-1.797 1.764v2.31h3.594l-.468 3.6h-3.126V24h6.127C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z" />
                </svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                {/* Instagram Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.849.07 1.259.057 2.126.265 2.878.56.768.304 1.419.71 2.065 1.356.646.646 1.052 1.297 1.356 2.065.295.752.503 1.619.56 2.878.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.849c-.057 1.259-.265 2.126-.56 2.878-.304.768-.71 1.419-1.356 2.065-.646.646-1.297 1.052-2.065 1.356-.752.295-1.619.503-2.878.56-1.265.058-1.645.07-4.849.07s-3.584-.012-4.849-.07c-1.259-.057-2.126-.265-2.878-.56-.768-.304-1.419-.71-2.065-1.356-.646-.646-1.052-1.297-1.356-2.065-.295-.752-.503-1.619-.56-2.878-.058-1.265-.07-1.645-.07-4.849s.012-3.584.07-4.849c.057-1.259.265-2.126.56-2.878.304-.768.71-1.419 1.356-2.065.646-.646 1.297-1.052 2.065-1.356.752-.295 1.619-.503 2.878-.56 1.265-.058 1.645-.07 4.849-.07zM12 0C8.691 0 8.294.014 7.052.073 5.805.131 4.771.335 3.866.707c-.92.384-1.741.934-2.5 1.693-.758.758-1.309 1.58-1.693 2.5-.372.905-.576 1.94-.634 3.187C.014 8.294 0 8.691 0 12c0 3.309.014 3.706.073 4.948.058 1.247.262 2.282.634 3.187.384.92.934 1.741 1.693 2.5.758.758 1.58 1.309 2.5 1.693.905.372 1.94.576 3.187.634C8.294 23.986 8.691 24 12 24c3.309 0 3.706-.014 4.948-.073 1.247-.058 2.282-.262 3.187-.634.92-.384 1.741-.934 2.5-1.693.758-.758 1.309-1.58 1.693-2.5.372-.905.576-1.94.634-3.187C23.986 15.706 24 15.309 24 12c0-3.309-.014-3.706-.073-4.948-.058-1.247-.262-2.282-.634-3.187-.384-.92-.934-1.741-1.693-2.5-.758-.758-1.58-1.309-2.5-1.693-.905-.372-1.94-.576-3.187-.634C15.706.014 15.309 0 12 0z" />
                </svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                {/* Twitter Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.954 4.569c-.885.392-1.83.656-2.825.775 1.014-.611 1.794-1.574 2.163-2.724-.949.563-2.001.974-3.127 1.195-.897-.956-2.178-1.555-3.594-1.555-2.717 0-4.92 2.204-4.92 4.917 0 .385.045.762.127 1.124-4.083-.205-7.697-2.162-10.123-5.134-.422.724-.664 1.561-.664 2.475 0 1.71.87 3.213 2.191 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.697 4.374 3.946 4.827-.413.112-.849.171-1.296.171-.314 0-.622-.03-.923-.086.623 1.947 2.432 3.366 4.576 3.405-1.675 1.312-3.787 2.095-6.081 2.095-.395 0-.786-.023-1.17-.067 2.169 1.392 4.743 2.205 7.514 2.205 9.019 0 13.955-7.469 13.955-13.955 0-.21-.005-.423-.014-.635.961-.694 1.797-1.56 2.457-2.548l-.047-.02z" />
                </svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                {/* LinkedIn Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.543C0 23.228.792 24 1.771 24h20.451C23.206 24 24 23.228 24 22.272V1.729C24 .774 23.206 0 22.225 0zm-14.08 20.452H4.982V9.016h3.162v11.436zm-1.573-12.92c-1.01 0-1.825-.822-1.825-1.832 0-1.01.815-1.833 1.825-1.833 1.01 0 1.825.823 1.825 1.833 0 1.01-.815 1.832-1.825 1.832zm13.865 12.92h-3.162v-5.568c0-1.329-.027-3.043-1.854-3.043-1.855 0-2.14 1.447-2.14 2.94v5.671h-3.16V9.016h3.036v1.558h.042c.424-.802 1.455-1.646 2.998-1.646 3.205 0 3.797 2.109 3.797 4.855v6.669z" />
                </svg>
              </a>
            </SocialIcons>
          </FooterRight>
        </FooterContent>
        <FooterBottom>&copy; 2024 ArtistryHub - All Rights Reserved.</FooterBottom>
      </FooterContainer>
    );
};

export default Footer;

// Styled Components
const FooterContainer = styled.footer`
  background-color: rgb(105, 137, 104);
  color: #ecf0f1;
  padding: 40px 0;
  font-family: 'Arial', sans-serif;
  position: relative;
  width: 100%;
  bottom: 0;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterLeft = styled.div`
  h3 {
    font-size: 28px;
    color: #ecf0f1;
  }

  p {
    font-size: 16px;
    color: #bdc3c7;
    margin-top: 10px;
  }
`;

const FooterMiddle = styled.div`
  ul {
    list-style: none;
    padding: 0;
  }

  ul li {
    margin: 10px 0;
  }

  ul li a {
    color: #ecf0f1;
    text-decoration: none;
    font-size: 16px;
    transition: color 0.3s;
  }

  ul li a:hover {
    color: #f39c12;
  }
`;

const FooterRight = styled.div`
  h4 {
    font-size: 20px;
    color: #ecf0f1;
  }
`;

const SocialIcons = styled.div`
  a {
    margin: 0 10px;
    display: inline-block;
    color: #ecf0f1;
    transition: color 0.3s;

    &:hover {
      color: #f39c12;
    }
  }

  svg {
    width: 30px;
    height: 30px;
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  margin-top: 20px;
  border-top: 1px solid #34495e;
  padding-top: 20px;

  p {
    font-size: 14px;
    color: #bdc3c7;
  }
`;

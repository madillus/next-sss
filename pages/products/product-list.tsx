import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import nextCookies from 'next-cookies';
import Layout from '../../components/Layout';
import { addToCookie } from '../../util/cookies';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import BaseballHatLogo from '../../images/BaseballHatLogo.png';
import styled from 'styled-components';
import { GetServerSidePropsContext } from 'next';
// import cookie from 'js-cookie';

const HeroContent = styled.div`
  border-radius: 2rem 2rem 2rem 2rem;
  opacity: 0.9;
  color: ghostwhite;
  padding: 0.5rem, 0rem, 0.375rem;
  max-width: 60rem;
  margin-left: auto;
  margin-right: auto;

  background-color: #2b2020;
`;

const CardGrid = styled.div`
  padding-top: 4rem;
  padding-bottom: 10rem;
  max-width: 60rem;
  margin-left: auto;
  margin-right: auto;
`;
const CardCard = styled.div`
  padding-top: 10%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #2b2020;
  color: ghostwhite;
  opacity: 0.9;
  border-radius: 2rem 2rem 2rem 2rem;
`;

const CardImage = styled.image`
  cursor: pointer;
  padding-top: 56.25%;
  background-image: url(${BaseballHatLogo});
  background-attachment: local;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: -1;
`;

const CardContent = styled.div`
  flex-grow: 1;
`;

const CartButton = styled.button`
  cursor: pointer;
  border: 0;
  margin: 5px 0;
  font-size: 1rem;
  color: ghostwhite;
  background-color: #2b2020;
  margin-left: auto;
  margin-right: auto;
`;

export default function ProductList(props: any) {
  const [cartConditionFromCookie, setCartConditionFromCookie] = useState(
    props.cartConditionFromCookie,
  );

  const [
    productsWithCartConditionData,
    setProductsWithCartConditionData,
  ] = useState(props.products);

  useEffect(() => {
    setProductsWithCartConditionData(
      props.products.map((product: any) => {
        return {
          ...product,
          cartCondition: cartConditionFromCookie.includes(product.id),
        };
      }),
    );
  }, [
    props.products,
    cartConditionFromCookie,
    setProductsWithCartConditionData,
  ]);

  return (
    <Layout>
      <Head>
        <title>product list</title>
      </Head>
      <HeroContent>
        <Typography
          component="h1"
          variant="h2"
          align="center"

          gutterBottom
        >
          BRIKTOP
        </Typography>
        <Typography variant="h5" align="center"  paragraph>
          While our collection might be small, it is made from the highest
          quality materials, sourced from sustainable suppliers.
        </Typography>
      </HeroContent>
      <CardGrid>
        <Grid container spacing={4}>
          {productsWithCartConditionData.map((product: any) => (
            <Grid item key={product} xs={12} sm={6} md={4}>
              <CardCard>
                <Link href={`/products/${product.id}`}>
                  <CardImage />
                </Link>
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    align="center"
                  >
                    {product.name}
                  </Typography>
                </CardContent>
                <CartButton>{product.price}</CartButton>
                <CartButton
                  onClick={() => {
                    const cartCondition = addToCookie(product.id);
                    setCartConditionFromCookie(cartCondition);
                  }}
                >
                  {product.cartCondition ? 'Remove from cart' : 'Add to cart'}
                </CartButton>
              </CardCard>
            </Grid>
          ))}
        </Grid>
      </CardGrid>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getProducts } = await import('../../util/database');
  const products = await getProducts();

  const allCookies = nextCookies(context);

  const cartCondition = allCookies.cartCondition || [];

  return {
    props: {
      cartConditionFromCookie: cartCondition,
      products,
    },
  };
}

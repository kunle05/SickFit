import Link from 'next/link';
import styled from 'styled-components';
import Cart from './Cart';
import Nav from './Nav';
import Search from './Search';

const Logo = styled.h1`
    font-size: 4rem;
    margin-left: 2rem;
    position: relative;
    z-index: 2;
    transform: skew(-7deg);
    a {
        color: white;
        background: red;
        text-decoration: none;
        text-transform: uppercase;
        padding: 0.5rem 1rem;
    }
    @media (max-width: 1300px) {
        margin: 0;
        text-align: center;
    }
`;

const HeaderStyles = styled.header`
    .bar {
        border-bottom: 10px solid var(--black, black);
        display: grid;
        grid-template-columns: auto 1fr;
        justify-content: space-between;
        align-items: stretch;
        @media (max-width: 1300px) {
            grid-template-columns: 1fr;
            justify-content: center
        }
    }
    .sub-bar {
        display: grid;
        grid-template-columns: 1fr auto;
        border-bottom: 1px solid var(--lightGrey, lightGrey);
    }
`;

const Header = () => {
    return (
        <HeaderStyles>
            <div className="bar">
                <Logo>
                    <Link href="/">Sick fits</Link>
                </Logo>
                <Nav />
            </div>
            <div className="sub-bar">
                <Search />
            </div>
            <Cart />
        </HeaderStyles>
    );
};

export default Header;
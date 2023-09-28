// Header.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { FaSearch, FaUser, FaSignInAlt } from 'react-icons/fa';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { CgMenu } from 'react-icons/cg';
import { Images } from '@constants/constants';
import ButtonComponent from './Button';
import { logout } from '@slices/authSlice';
import { useLogoutMutation } from '@slices/usersApiSlice';
import { IsAccountValid } from '@middleware/middleware';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchParam, setSearchParam] = useState('');
  const [isLoading, setLoading] = useState({ operation: '', status: false });
  const [scrollDownState, setScrollDownState] = useState(false);
  const [dropdownMenu, setDropdownMenu] = useState(false);

  IsAccountValid();

  const { push } = useRouter();
  const chakraToast = useToast();
  const dispatch = useDispatch();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    setLoading({ ...isLoading, operation: 'logout', status: true });

    if (dropdownMenu) setDropdownMenu(false);

    try {
      const res = await logoutApiCall().unwrap();
      setLoading({ ...isLoading, operation: '', status: false });
      dispatch(logout());
      push('/');
    } catch (err) {
      setLoading({ ...isLoading, operation: '', status: false });
      chakraToast({
        title: 'Error has occurred',
        description: err.data?.message ? err.data?.message : err.data || err.error,
        status: 'error',
        duration: 5000,
        isClosable: false,
      });
    }
  };

  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
    setLoading((prevState) => ({ ...prevState, operation: 'search', status: true }));

    if (mobileNavOpen) setMobileNavOpen(false);

    if (searchParam === '') {
      return chakraToast({
        title: 'Error',
        description: 'Search cannot be empty',
        status: 'error',
        duration: 5000,
        isClosable: false,
      });
    }

    setLoading({ ...isLoading, operation: '', status: false });
    push(`/search?q=${searchParam}`);
  };

  const stickyNavbarActivate = () => {
    let lastScrollIndex = 0;

    if (window)
      window.addEventListener('scroll', () => {
        const currentScrollIndex = window.scrollY;

        if (currentScrollIndex <= 0) {
          setScrollDownState(true);
        }

        if (currentScrollIndex > lastScrollIndex) setScrollDownState(true);

        if (currentScrollIndex < lastScrollIndex) setScrollDownState(false);

        lastScrollIndex = currentScrollIndex;
      });
  };

  const handleUserIp = async () => {
    const res = await fetch('https://geolocation-db.com/json/4aebddc0-500e-11ee-9b7d-f1b795d54ff5');
    const data = await res.json();
    console.log({ data });
  };

  useEffect(() => {
    stickyNavbarActivate();
    handleUserIp();
  }, []);

  const DropdownLinks = [
    { name: 'Account', link: '/account' },
    { name: 'Schedule a meal', link: '/schedule' },
    { name: 'Loyalty Points', link: '/loyalty' },
    { name: 'Subscription', link: '/subscription' },
    { name: 'Support', link: '/' },
    { name: 'Invoices & Receipts', link: '/' },
    { name: 'Support', link: '/' },
    { name: 'Invoices & Receipts', link: '/' },
  ];

  return (
    <Box
      as="header"
      bg="white"
      borderBottomWidth="1px"
      borderColor="gray.200"
      position={scrollDownState ? 'sticky' : 'static'}
      top={0}
      zIndex="sticky"
      transition="background-color 0.2s"
    >
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        maxW={{ xl: '1920px' }}
        py={4}
        px={4}
        mx="auto"
      >
        {/* Logo */}
        <Link href="/">
          <a>
            <Image src={Images.Logo} alt="Logo" width={160} height={40} loading="lazy" />
          </a>
        </Link>

        {/* Mobile navigation */}
        <Box display={{ base: 'block', lg: 'none' }}>
          <Button variant="link" onClick={() => setMobileNavOpen(!mobileNavOpen)} size="lg">
            {mobileNavOpen ? <CloseButton size="24px" /> : <CgMenu size="24px" />}
          </Button>
        </Box>

        {/* Desktop navigation */}
        <Stack
          as="ul"
          direction={{ base: 'column', lg: 'row' }}
          spacing={8}
          display={{ base: mobileNavOpen ? 'block' : 'none', lg: 'flex' }}
          alignItems={{ base: 'center', lg: 'center' }}
          mt={{ base: 4, lg: 0 }}
          ml={{ base: 0, lg: 'auto' }}
          listStyleType="none"
          flexGrow={1}
          pl={0}
          transition="all 0.3s ease-in-out"
        >
          {/* Home */}
          <Box as="li">
            <Link href="/">
              <a>Home</a>
            </Link>
          </Box>

          {/* Products */}
          <Box as="li">
            <Link href="/products">
              <a>Products</a>
            </Link>
          </Box>

          {/* Contact */}
          <Box as="li">
            <Link href="/contact">
              <a>Contact</a>
            </Link>
          </Box>

          {/* Search */}
          <Box as="li">
            <form onSubmit={handleSearchFormSubmit}>
              <InputGroup size="sm">
                <InputLeftElement pointerEvents="none">
                  <FaSearch color="gray.300" />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="Search..."
                  variant="filled"
                  value={searchParam}
                  onChange={(e) => setSearchParam(e.target.value)}
                />
              </InputGroup>
            </form>
          </Box>
        </Stack>

        {/* Right section */}
       
        {/* Right section */}
        <Flex align="center">
          {/* Cart */}
          <Box display={{ base: 'none', lg: 'block' }}>
            <ButtonComponent
              variant="icon"
              icon={<AiOutlineShoppingCart size="24px" />}
              onClick={() => push('/cart')}
            />
          </Box>

          {/* User dropdown */}
          {userInfo ? (
            <Box ml={4} display={{ base: 'none', lg: 'block' }}>
              <ButtonComponent
                variant="icon"
                icon={<FaUser size="20px" />}
                onClick={() => setDropdownMenu(!dropdownMenu)}
              />

              {dropdownMenu && (
                <Box
                  bg="white"
                  boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                  borderRadius="md"
                  mt={2}
                  position="absolute"
                  right={0}
                  zIndex={3}
                >
                  <ul>
                    {DropdownLinks.map((item, index) => (
                      <li key={index}>
                        <Link href={item.link}>
                          <a
                            onClick={() => setDropdownMenu(false)}
                            className="dropdown-link"
                          >
                            {item.name}
                          </a>
                        </Link>
                      </li>
                    ))}

                    <li>
                      <a
                        className="dropdown-link"
                        onClick={() => logoutHandler()}
                      >
                        Log Out
                      </a>
                    </li>
                  </ul>
                </Box>
              )}
            </Box>
          ) : (
            <Box ml={4} display={{ base: 'none', lg: 'block' }}>
              <ButtonComponent
                variant="icon"
                icon={<FaSignInAlt size="20px" />}
                onClick={() => push('/login')}
              />
            </Box>
          )}

          {/* Cart mobile */}
          <Box display={{ base: 'block', lg: 'none' }}>
            <ButtonComponent
              variant="icon"
              icon={<AiOutlineShoppingCart size="24px" />}
              onClick={() => push('/cart')}
            />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;


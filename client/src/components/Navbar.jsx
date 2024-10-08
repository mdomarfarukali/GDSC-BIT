import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useWindowDimension from '../utils/useWindowDimension'
import { navData } from '../utils/navbar'
import { useAuthStore } from '../store/useAuthStore'
import { useAnimStore } from '../store/useAnimStore'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export const Navbar = () => {
  const [dropdown, setDropdown] = useState(false)
  const { width } = useWindowDimension()
  const { verifyLoading, verifySuccess, user } = useAuthStore()
  const {
    menuPopup,
    mobileMenu,
    setMobileMenu,
    openMenu,
    closeMenu,
    avatarMenu,
    setAvatarMenu,
    openAvatar,
    closeAvatar
  } = useAnimStore()

  function handleMenuToggle () {
    setDropdown(!dropdown)
    if (mobileMenu) {
      closeMenu()
      setMobileMenu(false)
    } else {
      openMenu()
      setMobileMenu(true)
    }
  }

  function handleAvatarToggle () {
    if (avatarMenu) {
      closeAvatar()
      setDropdown(true)
    } else {
      setDropdown(false)
      openAvatar()
    }
    setAvatarMenu(!avatarMenu)
  }
  // console.log(verifySuccess)

  useEffect(() => {
    if (width <= 640 && menuPopup) document.body.style.overflow = 'hidden'
    else {
      document.body.style.overflow = ''
      closeMenu()
      setDropdown(false)
    }
  }, [width, menuPopup])

  useEffect(() => {
    if (avatarMenu) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
  }, [avatarMenu])

  return (
    <div className='Navbar-container'>
      <div className={`navbar-inner-cont ${dropdown ? 'expanded' : ''}`}>
        <div className='Navbar-flex-container'>
          <Link to='/' className='Navbar-logo'>
            <img src='/logo-crop.png' alt='logo' />
          </Link>
          <div className='Navbar-links'>
            {navData.map(item => (
              <Link to={item.link} className='Navbar-link' key={item.id}>
                <span>{item.name}</span>
                <div className='Navbar-link-highlight' />
              </Link>
            ))}
          </div>
          <div className='Navbar-auth'>
            {verifyLoading ? (
              <div className='relative w-[40px] h-[40px] rounded-full  overflow-hidden'>
                <Skeleton className='absolute -top-1 left-0 right-0 bottom-0 w-full h-full' />
              </div>
            ) : !verifyLoading && !verifySuccess ? (
              <Link to='/auth' className='Navbar-signin-button'>
                Sign in
              </Link>
            ) : (
              !verifyLoading &&
              verifySuccess && (
                <div
                  className='w-[40px] h-[40px] rounded-full border border-[#3c82f6] bg-white overflow-hidden cursor-pointer'
                  onClick={() => handleAvatarToggle()}
                >
                  <img
                    src={user?.avatar?.url ? user.avatar.url : '/user.svg'}
                    className='w-full h-full object-contain'
                  />
                </div>
              )
            )}
            {/* Mobile Menu toggler */}
            <button
              className='Navbar-menu-toggler'
              onClick={() => handleMenuToggle()}
              title='Click to open menu'
            >
              <div
                className={`Navbar-menu-bar-container ${
                  mobileMenu && 'active'
                }`}
              >
                <div
                  className={`Navbar-menu-toggler-top arrow-bar ${
                    mobileMenu && 'active'
                  }`}
                ></div>
                <div
                  className={`Navbar-menu-toggler-bottom ${
                    mobileMenu && 'active'
                  } arrow-bar`}
                ></div>
              </div>
            </button>
          </div>
        </div>

        {/* Experiment with nav */}
        <ul className='mobile-links-container'>
          <div className='mobile-view-control'>
            {navData.map((item, index) => (
              <li key={index}>
                <Link to={item.link} className='Navbar-link' key={item.id}>
                  <span>{item.name}</span>
                  <div className='Navbar-link-highlight' />
                </Link>
              </li>
            ))}
          </div>

          <div className='mobile-profile-control'>
            <span className='mobile-profile-vr'></span>
            <div>
              <button>Sign out</button>
              <span>{'|'}</span>
              <button>Go to Profile</button>
            </div>
          </div>
        </ul>
      </div>
    </div>
  )
}

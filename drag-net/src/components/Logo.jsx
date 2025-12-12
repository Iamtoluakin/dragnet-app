import React from 'react';
import LogoSVG from '../../public/logo-dragnet.svg';

export default function Logo({ size = 64 }) {
  return (
    <img src={LogoSVG} alt="Dragnet logo" style={{ width: size, height: 'auto' }} />
  );
}

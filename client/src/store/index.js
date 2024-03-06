import { proxy } from "valtio";

const state = proxy({
    intro:true,
    color:'#443722',
    isLogoTexture:true,
    isFullTexture: false,
    logoDecal: '../../public/nft.avif',
    fullDecal: './threejs.png',
});

export default state;
const genAvatar = () => {
    const index = Math.floor(Math.random() * 100) + 1;
    const image = `https://avatar.iran.liara.run/public/${index}`;
    return image;
};
export default genAvatar;

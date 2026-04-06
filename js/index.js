// Smiley reacts when hovering social links
const links = Array.from(document.querySelectorAll('.hero__links a'));

links.forEach(link => {
    link.addEventListener('mouseover', () => {
        document.getElementById('right-eye').setAttribute('ry', 1);
        document.getElementById('right-brow').setAttribute('d', 'M 48 33 Q 53 30 58 33');
        document.getElementById('smile').setAttribute('d', 'M 27 54 C 33 60, 47 60, 53 50');
    });

    link.addEventListener('mouseout', () => {
        document.getElementById('right-eye').setAttribute('ry', 4);
        document.getElementById('right-brow').setAttribute('d', 'M 48 28 Q 53 25 58 28');
        document.getElementById('smile').setAttribute('d', 'M 27 54 C 33 60, 47 60, 53 54');
    });
});

const links = Array.from(document.querySelectorAll('.navigation-links a'));

links.forEach(link => {
    link.addEventListener('mouseover', () => {
        document.getElementById('right-eye').setAttribute('ry', 1);
        document.getElementById('right-brow').setAttribute('d', 'M 57 40 Q 61 38 64 40');
        document.getElementById('smile').setAttribute('d', 'M 38 62 C 43 67, 53 67, 62 59');
    });

    link.addEventListener('mouseout', () => {
        document.getElementById('right-eye').setAttribute('ry', 4);
        document.getElementById('right-brow').setAttribute('d', 'M 57 35 Q 61 33 64 35');
        document.getElementById('smile').setAttribute('d', 'M 38 62 C 43 67, 53 67, 62 62');
    });
});

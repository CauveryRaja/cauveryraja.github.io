const links = Array.from(document.querySelectorAll('.navigation-links a'));

links.forEach(link => {
    link.addEventListener('mouseover', () => {
        document.getElementById('right-eye').setAttribute('ry', 1);
        document.getElementById('right-brow').setAttribute('d', 'M 636 142 Q 638 140 641 142');
        document.getElementById('smile').setAttribute('d', 'M 620 158 C 625 163, 635 163, 640 155');
    });

    link.addEventListener('mouseout', () => {
        document.getElementById('right-eye').setAttribute('ry', 3);
        document.getElementById('right-brow').setAttribute('d', 'M 636 140 Q 638 138 641 140');
        document.getElementById('smile').setAttribute('d', 'M 620 158 C 625 163, 635 163, 640 158');
    });
});

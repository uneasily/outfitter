document.addEventListener("DOMContentLoaded", function() {
    const clothingItems = {
        shirt: ['IMG_7748.jpeg', 'IMG_7750.jpeg', 'IMG_7751.jpeg', 'IMG_7752.jpeg', 'IMG_7755.jpeg', 'IMG_7758.jpeg', 'IMG_7759.jpeg', 'IMG_7761.jpeg', 'IMG_7762.jpeg', 'IMG_7764.jpeg', 'IMG_7765.jpeg', 'IMG_8114.jpeg', 'IMG_8115.jpeg', 'IMG_8117.jpeg', 'IMG_8121.jpeg', 'IMG_8123.jpeg', 'IMG_8124.jpeg', 'IMG_8125.jpeg'],
        pants: ['IMG_7747.jpeg', 'IMG_7754.jpeg', 'IMG_8088.jpeg', 'IMG_8089.jpeg', 'IMG_8091.jpeg', 'IMG_8092.jpeg', 'IMG_8096.jpeg', 'IMG_8098.jpeg', 'IMG_8100.jpeg', 'IMG_8101.jpeg', 'IMG_8102.jpeg', 'IMG_8103.jpeg', 'IMG_8104.jpeg', 'IMG_8105.jpeg', 'IMG_8106.jpeg', 'IMG_8107.jpeg', 'IMG_8108.jpeg', 'IMG_8109.jpeg', 'IMG_8110.jpeg', 'IMG_8111.jpeg'],
        jacket: ['IMG_7749.jpeg', 'IMG_8126.jpeg', 'IMG_8127.jpeg', 'IMG_8128.jpeg', 'IMG_8130.jpeg', 'IMG_8131.jpeg', 'IMG_8132.jpeg', 'IMG_8133.jpeg', 'IMG_8134.jpeg', 'IMG_8135.jpeg', 'IMG_8136.jpeg', 'IMG_8139.jpeg']
    };

    const paths = {
        shirt: './shirts/',
        pants: './pants/',
        jacket: './jackets/'
    };

    let totalImages = clothingItems.shirt.length + clothingItems.pants.length + clothingItems.jacket.length;
    let loadedImages = 0;

    function preloadImage(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                loadedImages++;
                document.getElementById('progress-bar').style.width = `${(loadedImages / totalImages) * 100}%`;
                document.getElementById('progress-count').textContent = `${loadedImages}/${totalImages}`;
                resolve();
            };
            img.src = src;
        });
    }

    async function preloadAllImages() {
        const promises = [];

        Object.keys(clothingItems).forEach(category => {
            clothingItems[category].forEach(image => {
                promises.push(preloadImage(paths[category] + image));
            });
        });

        await Promise.all(promises);
        document.getElementById('loading-screen').classList.add('fade-out');
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
            document.getElementById('main-content').style.display = 'flex';
            document.getElementById('main-content').classList.add('fade-in');
        }, 1000); // Adjust the timeout to match the CSS transition duration
    }

    function updateImages() {
        if (!document.getElementById('lock-shirt').checked) {
            document.getElementById('shirt-image').src = paths.shirt + getRandomItem(clothingItems.shirt);
        }
        if (!document.getElementById('lock-pants').checked) {
            document.getElementById('pants-image').src = paths.pants + getRandomItem(clothingItems.pants);
        }
        if (!document.getElementById('lock-jacket').checked) {
            document.getElementById('jacket-image').src = paths.jacket + getRandomItem(clothingItems.jacket);
        }
    }

    document.getElementById('randomize').addEventListener('click', updateImages);

    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function makeDraggableResizable(element) {
        let isDragging = false;
        let isResizing = false;
        let startX, startY, startWidth, startHeight, startLeft, startTop;

        element.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('resize-handle')) {
                e.stopPropagation(); // Prevent drag event from firing
                isResizing = true;
                startX = e.clientX;
                startY = e.clientY;
                startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
                startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);
                startLeft = parseInt(document.defaultView.getComputedStyle(element).left, 10);
                startTop = parseInt(document.defaultView.getComputedStyle(element).top, 10);
                document.addEventListener('mousemove', handleResize);
                document.addEventListener('mouseup', () => {
                    isResizing = false;
                    document.removeEventListener('mousemove', handleResize);
                });
            } else if (e.target.classList.contains('clothing-item')) {
                e.stopPropagation(); // Prevent other events from firing
                makeDraggable(e.target);
            }
        });

        function handleResize(e) {
            if (isResizing) {
                const aspectRatio = startWidth / startHeight;
                const newWidth = e.clientX - element.getBoundingClientRect().left;
                const newHeight = newWidth / aspectRatio; // Maintain aspect ratio

                element.style.width = `${newWidth}px`;
                element.style.height = `${newHeight}px`;
                element.querySelector('img').style.width = `${newWidth}px`;
                element.querySelector('img').style.height = `${newHeight}px`;
            }
        }

        function makeDraggable(item) {
            let startX, startY, startLeft, startTop;

            item.addEventListener('mousedown', (e) => {
                if (e.target.classList.contains('resize-handle') || e.target.classList.contains('lock-checkbox')) return; // Prevent dragging when interacting with resize handle or checkbox
                e.stopPropagation(); // Prevent other events from firing
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                startLeft = parseInt(document.defaultView.getComputedStyle(item).left, 10);
                startTop = parseInt(document.defaultView.getComputedStyle(item).top, 10);
                document.addEventListener('mousemove', handleDrag);
                document.addEventListener('mouseup', () => {
                    isDragging = false;
                    document.removeEventListener('mousemove', handleDrag);
                });
            });

            function handleDrag(e) {
                if (isDragging) {
                    const x = e.clientX;
                    const y = e.clientY;
                    item.style.left = `${startLeft + (x - startX)}px`;
                    item.style.top = `${startTop + (y - startY)}px`;
                }
            }
        }

        function bringToFront(e) {
            document.querySelectorAll('.clothing-item').forEach(item => item.classList.remove('active'));
            e.currentTarget.classList.add('active');
        }

        element.addEventListener('click', bringToFront); // Add click event to bring item to front

        element.addEventListener('mouseover', () => {
            element.querySelector('.resize-handle').style.display = 'block'; // Show resize handle on hover
        });

        element.addEventListener('mouseout', () => {
            if (!isResizing) {
                element.querySelector('.resize-handle').style.display = 'none'; // Hide resize handle when not resizing
            }
        });

        makeDraggable(element); // Initialize dragging functionality
    }

    document.querySelectorAll('.clothing-item').forEach(makeDraggableResizable);

    // Initialize with random images
    preloadAllImages().then(updateImages);
});

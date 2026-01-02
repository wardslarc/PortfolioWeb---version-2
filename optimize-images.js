#!/usr/bin/env node
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminWebp from 'imagemin-webp';
import path from 'path';

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...\n');

  try {
    // Optimize PNG files
    console.log('Optimizing PNG files...');
    await imagemin(['public/**/*.png'], {
      destination: 'public/optimized',
      plugins: [
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    });
    console.log('✅ PNG files optimized\n');

    // Optimize JPG files
    console.log('Optimizing JPG files...');
    await imagemin(['public/**/*.jpg', 'public/**/*.jpeg'], {
      destination: 'public/optimized',
      plugins: [
        imageminMozjpeg({
          quality: 75,
          progressive: true,
        }),
      ],
    });
    console.log('✅ JPG files optimized\n');

    // Convert to WebP
    console.log('Converting images to WebP format...');
    await imagemin(['public/**/*.{png,jpg,jpeg}'], {
      destination: 'public/optimized',
      plugins: [imageminWebp({ quality: 75 })],
    });
    console.log('✅ WebP versions created\n');

    console.log('🎉 Image optimization complete!');
    console.log('📁 Optimized images saved to: public/optimized/');
    console.log('\n💡 Next steps:');
    console.log('1. Compare file sizes (original vs optimized)');
    console.log('2. Update image paths in components to use optimized versions');
    console.log('3. Use WebP with PNG fallbacks in <picture> tags');
    console.log('4. Re-run Lighthouse audit to measure improvement');

  } catch (error) {
    console.error('❌ Error during image optimization:', error);
    process.exit(1);
  }
}

optimizeImages();

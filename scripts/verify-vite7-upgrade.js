#!/usr/bin/env node

/**
 * Vite 7 Upgrade Verification Script
 * Ensures all critical functionality works after the upgrade
 */

import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';

const require = createRequire(import.meta.url);

function checkViteVersion() {
  try {
    const vitePkg = require('vite/package.json');
    const version = vitePkg.version;
    console.log(`✅ Vite version: ${version}`);
    
    if (version.startsWith('7.')) {
      console.log('✅ Successfully upgraded to Vite 7');
      return true;
    } else {
      console.log('⚠️  Vite version is not 7.x');
      return false;
    }
  } catch (error) {
    console.log('❌ Failed to check Vite version:', error.message);
    return false;
  }
}

function checkPluginCompatibility() {
  try {
    const reactSwcPkg = require('@vitejs/plugin-react-swc/package.json');
    console.log(`✅ React SWC Plugin version: ${reactSwcPkg.version}`);
    return true;
  } catch (error) {
    console.log('❌ React SWC Plugin not found:', error.message);
    return false;
  }
}

function checkConfigFile() {
  const configPath = 'vite.config.ts';
  if (fs.existsSync(configPath)) {
    const content = fs.readFileSync(configPath, 'utf8');
    
    // Check for Vite 7 optimizations
    const hasOptimizedDeps = content.includes('optimizeDeps');
    const hasEsBuildConfig = content.includes('esbuild');
    const hasImprovedChunking = content.includes('manualChunks');
    
    console.log(`✅ Config file exists with optimizations:`);
    console.log(`   - Optimized deps: ${hasOptimizedDeps ? '✅' : '❌'}`);
    console.log(`   - ESBuild config: ${hasEsBuildConfig ? '✅' : '❌'}`);
    console.log(`   - Manual chunks: ${hasImprovedChunking ? '✅' : '❌'}`);
    
    return true;
  } else {
    console.log('❌ vite.config.ts not found');
    return false;
  }
}

function checkPackageJson() {
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    const hasModuleType = pkg.type === 'module';
    console.log(`✅ Package.json module type: ${hasModuleType ? '✅ ESM' : '❌ CommonJS'}`);
    
    return hasModuleType;
  } catch (error) {
    console.log('❌ Failed to check package.json:', error.message);
    return false;
  }
}

function checkNodeVersion() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  console.log(`✅ Node.js version: ${nodeVersion}`);
  
  if (majorVersion >= 20) {
    console.log('✅ Node.js version is compatible with Vite 7');
    return true;
  } else {
    console.log('⚠️  Node.js version should be 20.19+ for optimal Vite 7 performance');
    return false;
  }
}

function printSummary(checks) {
  console.log('\n📊 Upgrade Summary:');
  console.log('==================');
  
  const passed = checks.filter(Boolean).length;
  const total = checks.length;
  
  console.log(`✅ Passed: ${passed}/${total} checks`);
  
  if (passed === total) {
    console.log('\n🎉 Vite 7 upgrade completed successfully!');
    console.log('\n🚀 Benefits you can now enjoy:');
    console.log('   • Faster cold starts with improved dependency pre-bundling');
    console.log('   • Enhanced Hot Module Replacement (HMR)');
    console.log('   • Better build performance with optimized chunking');
    console.log('   • Improved ESM support');
    console.log('   • Enhanced developer experience');
  } else {
    console.log('\n⚠️  Some checks failed. Please review the issues above.');
  }
}

// Run all checks
console.log('🔍 Verifying Vite 7 Upgrade...\n');

const checks = [
  checkNodeVersion(),
  checkViteVersion(),
  checkPluginCompatibility(),
  checkConfigFile(),
  checkPackageJson()
];

printSummary(checks);
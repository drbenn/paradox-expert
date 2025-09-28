import { useAppState } from "@/state/useAppState";


// 🔥 : Ironclad TypeScript definitions to avoid package conflicts
interface IAPPurchase {
  productId: string;
  transactionId?: string;
  transactionDate?: number;
  transactionReceipt?: string;
  [key: string]: any; // Allow additional properties
}

interface IAPResult {
  responseCode: string | number;
  results?: IAPPurchase[];
  [key: string]: any; // Allow additional properties
}

interface IAPResponseCode {
  OK: string | number;
  USER_CANCELED: string | number;
  ERROR: string | number;
  [key: string]: any;
}

// 🏆 : Define the IAP module interface
interface IAPModule {
  connectAsync(): Promise<void>;
  purchaseItemAsync(productId: string): Promise<IAPResult>;
  getPurchaseHistoryAsync(): Promise<IAPPurchase[]>;
  IAPResponseCode: IAPResponseCode;
}

// 🚀 : Safe import with fallback
let IAPService: IAPModule | null = null;

try {
  // @ts-ignore - We're handling this with our own types
  IAPService = require('expo-iap');
} catch (error) {
  logger.log('🚨 : expo-iap not available:', error);
}

/**
 * 🔥 : Initialize the IAP system
 * Connects to Apple/Google and restores any previous purchases
 */
const initializeIAP = async (): Promise<void> => {
  // logger.log('🔥 : Starting IAP initialization...');
  
  if (!IAPService) {
    // logger.log('🚨 : expo-iap not available - skipping IAP initialization');
    return;
  }

  try {
    // 🚀 STEP 1: Connect to the IAP system
    // logger.log('🚀 : Connecting to IAP system...');
    await IAPService.connectAsync();
    // logger.log('✅ : IAP system connected successfully!');
    
    // 🏆 STEP 2: Restore any previous purchases
    // logger.log('🏆 : Restoring previous purchases...');
    await restorePurchases();
    // logger.log('✅ : Purchase restoration complete!');
    
    // logger.log('🎉 : IAP initialization finished!');
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.log('❌ : Failed to initialize IAP:', errorMessage);
    // Don't throw - IAP failure shouldn't break the app
  }
};

/**
 * 🏆 : Restore previous purchases from Apple/Google
 * Automatically sets ad removal status if user previously purchased
 */
const restorePurchases = async (): Promise<void> => {
  if (!IAPService) {
    // logger.log('🚨 : IAP not available for restoration');
    return;
  }

  try {
    const purchases: IAPPurchase[] = await IAPService.getPurchaseHistoryAsync();
    // logger.log('🔍 : Found purchase history:', purchases.length, 'items');
    
    // Look for the "Remove Ads" purchase
    const removeAdsPurchase = purchases.find(
      (purchase: IAPPurchase) => purchase.productId === 'remove_ads_forever'
    );
    
    if (removeAdsPurchase) {
      // User previously bought ad removal!
      const adState = useAppState.getState();
      adState.setAdsPurchased(true);
      // logger.log('🏆 : Ads removed (restored from purchase history)!');
      // logger.log('🎯 Purchase details:', {
      //   productId: removeAdsPurchase.productId,
      //   transactionId: removeAdsPurchase.transactionId,
      //   transactionDate: removeAdsPurchase.transactionDate
      // });
    } else {
      // logger.log('💰 : No ad removal purchase found - user can still purchase');
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown restoration error';
    logger.log('❌ : Failed to restore purchases:', errorMessage);
  }
};

/**
 * 🔥 : Purchase result interface
 */
interface PurchaseResult {
  success: boolean;
  error?: string;
  transactionId?: string;
}

/**
 * 💰 : Purchase the "Remove Ads Forever" product
 * Returns success/failure status with optional error message
 */
export const purchaseRemoveAds = async (): Promise<PurchaseResult> => {
  // logger.log('💰 : Attempting to purchase ad removal...');
  
  if (!IAPService) {
    // logger.log('🚨 : expo-iap not available for purchase');
    return { 
      success: false, 
      error: 'In-app purchases not available on this device' 
    };
  }

  try {
    const result: IAPResult = await IAPService.purchaseItemAsync('remove_ads_forever');
    // logger.log('🔍 : Purchase result:', result);
    
    // Check if purchase was successful
    const isSuccess = result && (
      result.responseCode === IAPService.IAPResponseCode.OK ||
      result.responseCode === 'OK' ||
      result.responseCode === 0
    );
    
    if (isSuccess) {
      // Purchase successful!
      const adState = useAppState.getState();
      adState.setAdsPurchased(true);
      // logger.log('🏆 : Ad removal purchased successfully!');
      
      // Extract transaction ID if available
      const transactionId = result.results?.[0]?.transactionId || 
                          (result as any).transactionId || 
                          'unknown';
      
      // logger.log('🎯 Transaction completed:', {
      //   productId: 'remove_ads_forever',
      //   transactionId,
      //   responseCode: result.responseCode
      // });
      
      return { 
        success: true, 
        transactionId: transactionId 
      };
    } else {
      // logger.log('❌ : Purchase failed with response:', result.responseCode);
      
      // Handle specific error cases
      let errorMessage = 'Purchase failed';
      if (result.responseCode === IAPService.IAPResponseCode.USER_CANCELED || 
          result.responseCode === 'USER_CANCELED') {
        errorMessage = 'Purchase was canceled';
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  } catch (error: unknown) {
    logger.log('❌ : Purchase error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Purchase failed';
    
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};

/**
 * 🎯 : Check if IAP is available on this device
 * Useful for showing/hiding purchase buttons
 */
export const isIAPAvailable = (): boolean => {
  return IAPService !== null;
};

/**
 * 🔄 : Manually restore purchases
 * Can be called from a "Restore Purchases" button if needed
 */
export const manualRestorePurchases = async (): Promise<PurchaseResult> => {
  // logger.log('🔄 : Manual purchase restoration requested...');
  
  try {
    await restorePurchases();
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Restoration failed';
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};

export default initializeIAP;
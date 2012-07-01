//
//  PressableBarButton.h
//  ChickenPing
//
//  Created by Harry Jennerway on 01/03/2012.
//  Copyright (c) 2012 N/A. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface PressableBarButton : UIBarButtonItem {
    
}
@property (readwrite) CGFloat topPressedTextOffset; // the amount the button text shifts down when the button is pressed.
@property (readwrite) CGFloat leftTextOffset;
@property (strong) UIButton *btnInner;

-(PressableBarButton*) initWithImageStubName:(NSString*)imageName text:(NSString*)text target:(id)target action:(SEL)action;
-(PressableBarButton*) initWithImageStubName:(NSString*)imageName text:(NSString*)text buttonFramePadding:(double)buttonFramePadding target:(id)target action:(SEL)action;
-(void)setText:(NSString *)text;
@end

//
//  PressableBarButton.m
//  ChickenPing
//  A button which uses two images to render a pressable bar button
//
//  Created by Harry Jennerway on 01/03/2012.
//  Copyright (c) 2012 N/A. All rights reserved.
//

#import "Constants.h"
#import "PressableBarButton.h"
#import "NSString+Extension.h"

@implementation PressableBarButton
@synthesize leftTextOffset, btnInner, topPressedTextOffset;

/*
 * imageName - The base name of an image. Eg: if 'navbutton_unlock_black"' is supplied, 'navbutton_unlock_black".png'  and 'navbutton_unlock_black"_pressed.png' should exist
 * text - The text for the button
 * target - The object on which to raise the action
 * action - The method when the button is clicked
 */ 
-(PressableBarButton*) initWithImageStubName:(NSString*)imageName text:(NSString*)text target:(id)target action:(SEL)action {
    self = [self initWithImageStubName:imageName text:text buttonFramePadding:text == nil || [text isNullOrEmpty]?39:29 target:target action:action];
    topPressedTextOffset = 8;
    return self;
}

/*
 * imageName - The base name of an image. Eg: if 'navbutton_unlock_black"' is supplied, 'navbutton_unlock_black".png'  and 'navbutton_unlock_black"_pressed.png' should exist
 * text - The text for the button
 * target - The object on which to raise the action
 * action - The method when the button is clicked
 */ 
-(PressableBarButton*) initWithImageStubName:(NSString*)imageName text:(NSString*)text buttonFramePadding:(double)buttonFramePadding target:(id)target action:(SEL)action {
    btnInner = [UIButton buttonWithType:UIButtonTypeCustom];
    // Since the buttons can be any width we use a thin image with a stretchable center point
    UIImage *img = [[UIImage imageNamed:[imageName stringByAppendingString:@".png"]] stretchableImageWithLeftCapWidth:5 topCapHeight:0];
    UIImage *imgPressed = [[UIImage imageNamed:[imageName stringByAppendingString:@"_pressed.png"]] stretchableImageWithLeftCapWidth:5 topCapHeight:0];
    
    [[btnInner titleLabel] setFont:[UIFont boldSystemFontOfSize:12.0]];
    [[btnInner titleLabel] setTextAlignment:UITextAlignmentCenter];
    [btnInner setTitleColor:kButtonTextColor forState:UIControlStateNormal];
    [btnInner setTitleColor:kButtonTextColor forState:UIControlStateHighlighted];
    [btnInner setTitleShadowColor:kButtonTextShadowColor forState:UIControlStateNormal];
    [btnInner setTitleShadowColor:[UIColor clearColor] forState:UIControlStateHighlighted];
    [[btnInner titleLabel] setShadowOffset:CGSizeMake(0.0, 1.0)];
    
    CGSize textSize = [text sizeWithFont:[UIFont boldSystemFontOfSize:12.0]]; // title width
    CGRect buttonFrame = [btnInner frame];
    buttonFrame.size.width = textSize.width + buttonFramePadding; //  add padding to the button
    buttonFrame.size.height = img.size.height;
    [btnInner setFrame:buttonFrame];
    
    leftTextOffset = (buttonFrame.size.width - buttonFramePadding - textSize.width)/2; // center the text
    [btnInner setTitleEdgeInsets:UIEdgeInsetsMake(0,leftTextOffset, 0,0)]; // negative offset if pressed
    [btnInner addObserver:self forKeyPath:@"selected" options:NSKeyValueChangeSetting context:nil];
    [btnInner addObserver:self forKeyPath:@"highlighted" options:NSKeyValueChangeSetting context:nil];
        
    [btnInner setBackgroundImage:img forState:UIControlStateNormal];
    [btnInner setBackgroundImage:imgPressed forState:UIControlStateHighlighted];
    [btnInner setBackgroundImage:imgPressed forState:UIControlStateSelected];
    [btnInner setTitle:text forState:UIControlStateNormal];
    [btnInner addTarget:target action:action forControlEvents:UIControlEventTouchUpInside];
    self = [super initWithCustomView:btnInner];
    return self;
}

-(void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
    if([keyPath isEqualToString:@"selected"] || [keyPath isEqualToString:@"highlighted"]){   
        if(btnInner.selected || btnInner.highlighted){
            [btnInner setTitleEdgeInsets:UIEdgeInsetsMake(topPressedTextOffset,leftTextOffset,0,0)];
        } else {
            [btnInner setTitleEdgeInsets:UIEdgeInsetsMake(0,leftTextOffset,0,0)];
        }
    }
}

-(void)setText:(NSString *)text {
    [btnInner setTitle:text forState:UIControlStateNormal];
}
@end

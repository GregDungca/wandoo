//
//  FacebookLoginController.swift
//  ParseStarterProject-Swift
//
//  Created by Brian Kwon on 12/8/15.
//  Copyright © 2015 Parse. All rights reserved.
//

import UIKit
import FBSDKCoreKit
import FBSDKLoginKit
import ParseFacebookUtilsV4
import Parse

class FacebookLoginController: UIViewController {

    var userModel = UserModel.sharedUserInstance
    
    @IBAction func loginFacebookButtonThatTakesUsToTheLoginAtSafari(sender: AnyObject) {
        
        PFFacebookUtils.logInInBackgroundWithReadPermissions(["public_profile","user_education_history","user_birthday", "user_work_history","user_friends","user_likes", "email"], block: { (user:PFUser?, error:NSError?) -> Void in
            
            if(error == nil)
            {
                if let user = user {
                    if user.isNew {
                        let accessToken = FBSDKAccessToken.currentAccessToken().tokenString
                        self.userModel.storeFBDataIntoParse(user.objectId!, accessToken: accessToken) { () -> Void in
                            print ("hi")
                        }
                        //segue into profile editing page
                        print("New user signed up")
                        self.performSegueWithIdentifier("LoginFacebook", sender: self)
                    } else {
                        self.performSegueWithIdentifier("LoginFacebook", sender: self)
                        print("Already a user")
                        print(user.objectId!)
                        
                    }
                }
                
            }
            else
            {
                print(error!.localizedDescription)
            }
            
        })
    }
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        
        if self.navigationController != nil {
            self.navigationController!.navigationBarHidden = true
        }
        
        print(FBSDKAccessToken.currentAccessToken() == nil)
 
    }
    
    override func viewDidAppear(animated: Bool) {
        if (FBSDKAccessToken.currentAccessToken() != nil) {
            self.performSegueWithIdentifier("LoginFacebook", sender: self)
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
}



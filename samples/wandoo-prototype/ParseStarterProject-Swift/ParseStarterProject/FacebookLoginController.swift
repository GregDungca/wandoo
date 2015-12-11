//
//  FacebookLoginController.swift
//  ParseStarterProject-Swift
//
//  Created by Brian Kwon on 12/8/15.
//  Copyright © 2015 Parse. All rights reserved.
//

import UIKit
import FBSDKCoreKit
import ParseFacebookUtilsV4
import Parse

class FacebookLoginController: UIViewController {

    var userModel = UserModel()
    
    @IBAction func loginFacebookButtonThatTakesUsToTheLoginAtSafari(sender: AnyObject) {
        
        PFFacebookUtils.logInInBackgroundWithReadPermissions(["public_profile","user_education_history","user_birthday", "user_work_history","user_friends","user_likes"], block: { (user:PFUser?, error:NSError?) -> Void in
            
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
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
